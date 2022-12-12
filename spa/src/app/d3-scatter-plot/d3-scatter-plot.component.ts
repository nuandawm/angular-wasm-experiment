import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Selection } from 'd3';
import { _3d } from 'd3-3d';

const ScatterPlot = (function(d3SvgElement: Selection<any, any, any, any>){
  const START_ANGLE = Math.PI/4;
  let mouseX: number;
  let mouseY: number;
  let mx: number;
  let my: number;
  let xGridData: Array<Array<any>> = [];

  const grid3d = _3d()
    .shape('GRID', 20)
    .origin([300, 200]) // origin
    .rotateY( START_ANGLE) //  startAngle
    .rotateX(-START_ANGLE) // -startAngle
    .scale(20); // initialScale

  const processData = (grid3dData: any, tt: number) => {
    const xGrid: Selection<any, any, any, any> = d3SvgElement
      .selectAll('path.grid')
      .data(grid3dData, (d: any) => d.id);
    xGrid
      .enter()
      .append('path')
      .attr('class', '_3d grid')
      .merge(xGrid)
      .attr('stroke', 'black')
      .attr('stroke-width', 0.3)
      .attr('fill', d => d.ccw ? 'lightgrey' : '#717171')
      .attr('fill-opacity', 0.9)
      .attr('d', grid3d.draw);
    xGrid.exit().remove();
    d3.selectAll('._3d').sort(_3d().sort);
  }

  const dragged = (event: any) => {
    mouseX = mouseX || 0;
    mouseY = mouseY || 0;
    const beta   = (event.x - mx + mouseX) * Math.PI / 230 ;
    const alpha  = (event.y - my + mouseY) * Math.PI / 230  * (-1);
    const grid3dData = grid3d
      .rotateY(beta + START_ANGLE)
      .rotateX(alpha - START_ANGLE)
      (xGridData);
    processData(grid3dData, 0);
  }

  const dragStarted = (event: any) => {
    mx = event.x;
    my = event.y;
  }

  const dragEnded = (event: any) => {
    mouseX = event.x - mx + mouseX;
    mouseY = event.y - my + mouseY;
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
      xGridData.push([x, 1, z]);
    }
  }

  processData(
    grid3d(xGridData),
    1000
  );
})

@Component({
  selector: 'app-d3-scatter-plot',
  templateUrl: './d3-scatter-plot.component.html',
  styleUrls: ['./d3-scatter-plot.component.scss']
})
export class D3ScatterPlotComponent implements OnInit, AfterViewInit {
  private static START_ANGLE = Math.PI/4;

  @ViewChild('svgElement', {static: true}) svgElement: ElementRef | undefined;

  private d3SvgElement: Selection<any, any, any, any> | undefined;
  private mx: any;
  private my: any;
  private mouseX: any;
  private mouseY: any;
  private xGridData: any;
  private grid3d = _3d()
    .shape('GRID', 20)
    .origin([300, 200]) // origin
    .rotateY( D3ScatterPlotComponent.START_ANGLE) //  startAngle
    .rotateX(-D3ScatterPlotComponent.START_ANGLE) // -startAngle
    .scale(20); // initialScale

  constructor() { }

  private dragged(event: any) {
    this.mouseX = this.mouseX || 0;
    this.mouseY = this.mouseY || 0;
    const beta   = (event.x - this.mx + this.mouseX) * Math.PI / 230 ;
    const alpha  = (event.y - this.my + this.mouseY) * Math.PI / 230  * (-1);
    const grid3dData = this.grid3d
      .rotateY(beta + D3ScatterPlotComponent.START_ANGLE)
      .rotateX(alpha - D3ScatterPlotComponent.START_ANGLE)
      (this.xGridData);
    this.processData(grid3dData, 0);
  }

  private dragStarted(event: any) {
    this.mx = event.x;
    this.my = event.y;
  }

  private dragEnded(event: any) {
    this.mouseX = event.x - this.mx + this.mouseX;
    this.mouseY = event.y - this.my + this.mouseY;
  }

  private processData(grid3dData: any, tt: number) {
    if (this.d3SvgElement) {
      const xGrid: Selection<any, any, any, any> = this.d3SvgElement
        .selectAll('path.grid')
        .data(grid3dData, (d: any) => d.id);
      xGrid
        .enter()
        .append('path')
        .attr('class', '_3d grid')
        .merge(xGrid)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.3)
        .attr('fill', d => d.ccw ? 'lightgrey' : '#717171')
        .attr('fill-opacity', 0.9)
        .attr('d', this.grid3d.draw);
      xGrid.exit().remove();
      d3.selectAll('._3d').sort(_3d().sort);
    }
  }

  ngOnInit(): void {
    this.d3SvgElement = d3.select(this.svgElement?.nativeElement);
    this.d3SvgElement
      .attr('width', 600)
      .attr('height', 450)
      .call(d3.drag()
        .on('drag', event => this.dragged(event))
        .on('start', event => this.dragStarted(event))
        .on('end', event => this.dragEnded(event)))
      .append('g');

    this.xGridData = [];
    for (let z = -10; z < 10; z++) {
      for (let x = -10; x < 10; x++) {
        this.xGridData.push([x, 1, z]);
      }
    }

    this.processData(
      this.grid3d(this.xGridData),
      1000
    );
  }

  ngAfterViewInit() {
  }

}
