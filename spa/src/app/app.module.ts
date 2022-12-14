import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { D3ScatterPlotComponent } from './d3-scatter-plot/d3-scatter-plot.component';
import { PlotlyScatterPlotComponent } from './plotly-scatter-plot/plotly-scatter-plot.component';

@NgModule({
  declarations: [
    AppComponent,
    D3ScatterPlotComponent,
    PlotlyScatterPlotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
