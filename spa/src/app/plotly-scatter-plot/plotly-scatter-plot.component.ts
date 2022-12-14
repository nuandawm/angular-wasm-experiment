import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Plotly from 'plotly.js-dist-min';
@Component({
  selector: 'app-plotly-scatter-plot',
  templateUrl: './plotly-scatter-plot.component.html',
  styleUrls: ['./plotly-scatter-plot.component.scss']
})
export class PlotlyScatterPlotComponent implements OnInit {

  @ViewChild('plotContainerElement', {static: true}) plotContainerElement: ElementRef | undefined;

  @Input() points: Array<Array<number>> | undefined;
  constructor() { }
  ngOnInit(): void {
    if (this.points) {
      // Pick the first 400x400 points
      const size = 400;
      let xData = []
      let yData = []
      let zData = []
      for (let x=0; x<size; x++) {
        for (let y=0; y<size; y++) {
          xData.push(x);
          yData.push(y);
          zData.push(this.points[x][y]);
        }
      }

      const data: Plotly.Data[] = [{
        x: xData,
        y: yData,
        z: zData,
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          size: 1,
          opacity: 1,
          color: zData,
          colorscale: 'Viridis'
        },
      }];

      if (this.plotContainerElement) {
        Plotly.newPlot(this.plotContainerElement.nativeElement, data, {
          margin: { t: 0 }
        });
      }
    }
  }

}
