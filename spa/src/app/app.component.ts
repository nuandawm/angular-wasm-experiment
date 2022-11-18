import { Component, OnInit } from '@angular/core';
import { WasmService } from './wasm.service';
import { Observable, Subject, switchMap, tap } from 'rxjs';
import { DevToolsService } from './dev-tools.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wasm-angular-spa';

  sumResult$: Observable<number> | undefined;
  selectedFile$ = new Subject<File>();

  constructor(private wasmService: WasmService) {
  }

  ngOnInit() {
    this.sumResult$ = this.wasmService.wasmSum(40, 2);

    this.selectedFile$.pipe(
      switchMap(selectedFile => selectedFile.arrayBuffer().then(data => ({
        data,
        name: selectedFile.name
      })))
    ).subscribe(({data, name}) => {
      this.wasmService.createFile(name, new Uint8Array(data))
    })
  }

  onFileSelected(event: any) {
    const [selectedFile] = event.target.files;
    this.selectedFile$.next(selectedFile);
  }

}
