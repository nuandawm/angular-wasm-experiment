import { Component, OnInit } from '@angular/core';
import { WasmService } from './wasm.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wasm-angular-spa';

  sumResult$: Observable<number> | undefined;

  constructor(private wasmService: WasmService) {
  }

  ngOnInit() {
    this.sumResult$ = this.wasmService.wasmSum(40, 2);
  }

  onFileSelected(event: any) {
    const [selectedFile] = event.target.files;
    console.log(selectedFile);
  }

}
