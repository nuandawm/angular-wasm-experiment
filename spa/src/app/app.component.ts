import { Component, OnInit } from '@angular/core';
import { WasmService } from './wasm.service';
import { map, Observable, Subject, switchMap, tap } from 'rxjs';
import { DevToolsService } from './dev-tools.service';
import { SurfData } from './models/surf-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wasm-angular-spa';

  sumResult$: Observable<number> | undefined;
  surfData$: Observable<SurfData> | undefined;
  selectedFile$ = new Subject<File>();
  isWasmModuleReady$ = this.wasmService.isModuleReady$.asObservable();

  constructor(private wasmService: WasmService) {
  }

  ngOnInit() {
    this.surfData$ = this.selectedFile$.pipe(
      switchMap(selectedFile => selectedFile.arrayBuffer().then(data => ({
        data,
        name: selectedFile.name
      }))),
      // Create the file
      switchMap(({name, data}) => this.wasmService.createFile(name, new Uint8Array(data))
        .pipe(map(() => ({name, data})))),
      // Get data from the created file
      switchMap(({name, data}) => this.wasmService.wasmWrapperReadSurfFile(name)),
      tap(DevToolsService.getLogObserver('data'))
    );
  }

  onFileSelected(event: any) {
    const [selectedFile] = event.target.files;
    this.selectedFile$.next(selectedFile);
  }

}
