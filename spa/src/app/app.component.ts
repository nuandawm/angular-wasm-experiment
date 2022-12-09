import { Component, OnInit } from '@angular/core';
import { WasmService } from './wasm.service';
import { filter, map, Observable, shareReplay, Subject, switchMap, tap } from 'rxjs';
import { DevTools } from './utils/dev-tools';
import { SurfData } from './models/surf-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wasm-angular-spa';

  dataPoints$: Observable<Array<number>> | undefined;
  surfData$: Observable<SurfData> | undefined;
  selectedFile$ = new Subject<File>();
  isWasmModuleReady$ = this.wasmService.isModuleReady$.asObservable();

  constructor(private wasmService: WasmService) {
  }

  ngOnInit() {
    const createdFileName$: Observable<string> = this.selectedFile$.pipe(
      switchMap(selectedFile => selectedFile.arrayBuffer().then(data => ({
        data,
        name: selectedFile.name
      }))),
      // Create the file
      switchMap(({name, data}) => this.wasmService.createFile(name, new Uint8Array(data))
        .pipe(map(() => name))),
      shareReplay(1)
    );

    const fileNameAndMetadata$: Observable<{ name: string, metadata: SurfData }> = createdFileName$.pipe(
      // Get data from the created file
      switchMap(name => this.wasmService.readSurfFileMetadata(name)
        .pipe(map(metadata => ({ name, metadata })))),
      shareReplay(1)
    );

    this.surfData$ = fileNameAndMetadata$.pipe(
      map(({ metadata }) => metadata)
    );

    // Load the points using wrapperReadSurfFilePoints32
    this.dataPoints$ = fileNameAndMetadata$.pipe(
      switchMap(({ name, metadata }) =>
        this.wasmService.readSurfMatrixDataPoints32(name, metadata.dataStart, metadata.totalNumberOfPoints, metadata.xPoints, metadata.yPoints)),
      map(points => [
        points[50][0],
        points[50][1],
        points[50][2],
      ]),
      tap(DevTools.getLogObserver('points'))
    );
  }

  onFileSelected(event: any) {
    const [selectedFile] = event.target.files;
    this.selectedFile$.next(selectedFile);
  }

}
