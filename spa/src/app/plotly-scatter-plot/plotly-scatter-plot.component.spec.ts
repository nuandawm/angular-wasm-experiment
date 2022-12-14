import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyScatterPlotComponent } from './plotly-scatter-plot.component';

describe('PlotlyScatterPlotComponent', () => {
  let component: PlotlyScatterPlotComponent;
  let fixture: ComponentFixture<PlotlyScatterPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlotlyScatterPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlotlyScatterPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
