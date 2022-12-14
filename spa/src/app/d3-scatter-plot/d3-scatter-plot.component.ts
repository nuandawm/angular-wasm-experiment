import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Selection } from 'd3';
import { _3d } from 'd3-3d';

const ScatterPlot = (function(d3SvgElement: Selection<any, any, any, any>){
  const START_ANGLE = Math.PI/4;
  const INITAL_SCALE = 20;
  const ORIGIN = [300, 200];
  const SCATTER_POINT_SIZE = 1;
  let mouseX: number;
  let mouseY: number;
  let mx: number;
  let my: number;
  let alpha: number;
  let beta: number;
  let xGridData: Array<Array<number>> = [];
  let xScaleData: Array<Array<number>> = [];
  let yScaleData: Array<Array<number>> = [];
  let zScaleData: Array<Array<number>> = [];
  let scatterPointsData: Array<{x: number, y: number, z: number, id: string}> = [];

  const grid3d = _3d()
    .shape('GRID', 20)
    .origin(ORIGIN)
    .rotateY( START_ANGLE) //  startAngle
    .rotateX(-START_ANGLE) // -startAngle
    .scale(INITAL_SCALE);

  const point3d = _3d()
    .x(function(d: any){ return d.x; })
    .y(function(d: any){ return d.y; })
    .z(function(d: any){ return d.z; })
    .origin(ORIGIN)
    .rotateY( START_ANGLE)
    .rotateX(-START_ANGLE)
    .scale(INITAL_SCALE);

  const yScale3d = _3d()
    .shape('LINE_STRIP')
    .origin(ORIGIN)
    .rotateY( START_ANGLE)
    .rotateX(-START_ANGLE)
    .scale(INITAL_SCALE);

  function posPointX(d: any){
    return d.projected.x;
  }
  function posPointY(d: any){
    return d.projected.y;
  }

  const hideAxes = () => {
    d3SvgElement.selectAll('path.axis').style('display', 'none');
  }
  const processAxesData = (yScale3dData: any) => {
    /* ----------- Axis ----------- */
    const yScale: Selection<any, any, any, any> = d3SvgElement.selectAll('path.axis').data(yScale3dData);
    yScale
      .enter()
      .append('path')
      .attr('class', '_3d axis')
      .merge(yScale)
      .attr('stroke', 'black')
      .attr('stroke-width', .5)
      .attr('d', yScale3d.draw)
      // show axes
      .style('display', 'inline');
    yScale.exit().remove();
  }

  const hideElements = () => {
    d3SvgElement.selectAll('path.grid').style('display', 'none');
    d3SvgElement.selectAll('circle.point').style('display', 'none');
  }
  const processData = (grid3dData: any, pointsData: any) => {
    /* ----------- x-Grid ----------- */
    const xGrid: Selection<any, any, any, any> = d3SvgElement
      .selectAll('path.grid')
      .data(grid3dData, (d: any) => d.plane);
    xGrid
      .enter()
        .append('path')
        .attr('class', '_3d grid')
      .merge(xGrid)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.3)
        .attr('fill', d => d.ccw ? 'lightgrey' : '#717171')
        .attr('fill-opacity', 0.9)
        .attr('d', grid3d.draw)
        // show elements
        .style('display', 'inline');
    xGrid.exit().remove();

    /* ----------- POINTS ----------- */
    const points: Selection<any, any, any, any> = d3SvgElement.selectAll('circle.point').data(pointsData, ({ id }) => id);
    points
      .enter()
        .append('circle')
        .attr('class', '_3d point')
        .attr('opacity', 0)
        .attr('cx', posPointX)
        .attr('cy', posPointY)
      .merge(points)
        .attr('r', SCATTER_POINT_SIZE)
        .attr('fill', 'black')
        .attr('opacity', 1)
        .attr('cx', posPointX)
        .attr('cy', posPointY)
        // show elements
        .style('display', 'inline');
    points.exit().remove();

    // ???
    d3.selectAll('._3d').sort(_3d().sort);
  }

  const dragged = (event: any) => {
    mouseX = mouseX || 0;
    mouseY = mouseY || 0;
    beta   = (event.x - mx + mouseX) * Math.PI / 230 ;
    alpha  = (event.y - my + mouseY) * Math.PI / 230  * (-1);
    // maybe this could be elaborated only on dragEnd?
    const yScale3dData = yScale3d
      .rotateY(beta + START_ANGLE)
      .rotateX(alpha - START_ANGLE)
      ([xScaleData, yScaleData, zScaleData]);
    hideElements();
    processAxesData(yScale3dData);
  }

  const dragStarted = (event: any) => {
    mx = event.x;
    my = event.y;
  }

  const dragEnded = (event: any) => {
    mouseX = event.x - mx + mouseX;
    mouseY = event.y - my + mouseY;
    hideAxes();
    const grid3dData = grid3d
      .rotateY(beta + START_ANGLE)
      .rotateX(alpha - START_ANGLE)
      (xGridData);
    const scatterPoints3dData = point3d
      .rotateY(beta + START_ANGLE)
      .rotateX(alpha - START_ANGLE)
      (scatterPointsData);
    processData(grid3dData, scatterPoints3dData);
  }

  // Init
  d3SvgElement.attr('width', 600)
    .attr('height', 450)
    .call(d3.drag()
      .on('drag', event => dragged(event))
      .on('start', event => dragStarted(event))
      .on('end', event => dragEnded(event)))
    .append('g');

  for (let z = -10; z < 10; z++) {
    for (let x = -10; x < 10; x++) {
      xGridData.push([x, 0, z]);
      scatterPointsData.push({
        x, y: -2, z, id: `cnt_${x}_${z}`
      });
    }
  }
  d3.range(0, 5, 1).forEach(function(d){ xScaleData.push([-d, 0, 0]); });
  d3.range(0, 5, 1).forEach(function(d){ yScaleData.push([0, -d, 0]); });
  d3.range(0, 5, 1).forEach(function(d){ zScaleData.push([0, 0, d]); });

  const pointsPerAxis = 80;
  for (let z = -(pointsPerAxis / 2); z < (pointsPerAxis / 2); z++) {
    for (let x = -(pointsPerAxis / 2); x < (pointsPerAxis / 2); x++) {
      scatterPointsData.push({
        x: x * 20 / pointsPerAxis,
        y: -2,
        z: z * 20 / pointsPerAxis, id: `cnt_${x}_${z}`
      });
    }
  }

  const grid3dData = grid3d(xGridData);
  const scatterPoints3dData = point3d(scatterPointsData);
  processData(
    grid3dData,
    scatterPoints3dData
  );
})

@Component({
  selector: 'app-d3-scatter-plot',
  templateUrl: './d3-scatter-plot.component.html',
  styleUrls: ['./d3-scatter-plot.component.scss']
})
export class D3ScatterPlotComponent implements OnInit {

  @ViewChild('svgElement', {static: true}) svgElement: ElementRef | undefined;

  constructor() { }

  ngOnInit(): void {
    ScatterPlot(
      d3.select(this.svgElement?.nativeElement)
    );
  }

}
