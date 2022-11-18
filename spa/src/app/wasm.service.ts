import { Injectable } from '@angular/core';

// @ts-ignore
import * as Module from '../assets/wasm_wrapper.js';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DevToolsService } from './dev-tools.service';

type WasmModule = {
  _hello: (n: number) => number,
  _sum: (m: number, n: number) => number,
  FS_createDataFile: (path: string, fileName: string, data: Uint8Array, canRead: boolean, canWrite: boolean) => void
}

@Injectable({
  providedIn: 'root'
})
export class WasmService {
  public module$: ReplaySubject<WasmModule> = new ReplaySubject<WasmModule>();

  constructor(private httpClient: HttpClient) {
    this.httpClient.get('assets/wasm_wrapper.wasm', { responseType: 'arraybuffer' }).pipe(
      map(buffer => new Uint8Array(buffer)),
      map(binary => Module({
        wasmBinary: binary
      }))
    ).subscribe(module => {
      this.module$.next(module);
    });
  }

  wasmHello(input: number): Observable<number> {
    return this.module$.pipe(
      map(module => module._hello(input))
    );
  }

  wasmSum(first: number, second: number): Observable<number> {
    return this.module$.pipe(
      map(module => module._sum(first, second))
    )
  }

  createFile(fileName: string, fileData: Uint8Array): Observable<void> {
    return this.module$.pipe(
      map(module => module.FS_createDataFile('/', fileName, fileData, true, true))
    )
  }
}
