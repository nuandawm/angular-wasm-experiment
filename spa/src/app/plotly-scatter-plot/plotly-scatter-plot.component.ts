import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Plotly from 'plotly.js-dist-min';
import { filter, ReplaySubject, Subject } from 'rxjs';
@Component({
  selector: 'app-plotly-scatter-plot',
  templateUrl: './plotly-scatter-plot.component.html',
  styleUrls: ['./plotly-scatter-plot.component.scss']
})
export class PlotlyScatterPlotComponent implements OnInit {

  @ViewChild('plotContainerElement', {static: true}) plotContainerElement: ElementRef | undefined;

  private _points$ = new ReplaySubject<Array<Array<number>>>(1);
  @Input() set points(value: Array<Array<number>>){
    this._points$.next(value);
  };
  constructor() { }
  ngOnInit(): void {
    this._points$.pipe(
      filter(points => points !== undefined)
    ).subscribe(points => {
      const xData = []
      const yData = []
      const zData = []
      const size = 200;
      for (let x=0; x<size; x++) {
        for (let y=0; y<size; y++) {
          xData.push(x);
          yData.push(y);
          zData.push(points[x][y]);
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
          opacity: 1
        },
      }];

      if (this.plotContainerElement) {
        Plotly.newPlot(this.plotContainerElement.nativeElement, data, {
          margin: { t: 0 }
        });
      }
    });
  }

}
