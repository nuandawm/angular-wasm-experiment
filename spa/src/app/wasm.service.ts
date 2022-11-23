import { Injectable } from '@angular/core';

// @ts-ignore
import * as Module from '../assets/wasm_wrapper.js';
import { BehaviorSubject, first, map, Observable, Subject } from 'rxjs';
import { DevToolsService } from './dev-tools.service';
import { WasmWorkerInMessage, WasmWorkerOutMessage } from './models/wasm-worker';
import { SurfData } from './models/surf-data';

type WasmModule = {
  _getSizeOfPoints: () => number,
  FS_createDataFile: (path: string, fileName: string, data: Uint8Array, canRead: boolean, canWrite: boolean) => void
};

@Injectable({
  providedIn: 'root'
})
export class WasmService {
  private wasmWorker: Worker = new Worker(new URL('./app.worker', import.meta.url));
  private wasmWorkerMessage$ = new Subject<WasmWorkerOutMessage>();
  public isModuleReady$ = new BehaviorSubject<boolean>(false);

  private sendWasmWorkerMessage(message: WasmWorkerInMessage): void {
    this.wasmWorker.postMessage(message);
  }

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.wasmWorker.onmessage = ({ data }) => {
        this.wasmWorkerMessage$.next(data);
      };

      this.sendWasmWorkerMessage({
        action: 'INIT'
      });

      this.wasmWorkerMessage$.pipe(
        first()
      ).subscribe(({ type }) => {
        if (type === 'MODULE_LOADED') {
          this.isModuleReady$.next(true);
        }
      });
    } else {
      // Web Workers are not supported in this environment.
    }
  }

  wasmGetSizeOfPoints() {
    this.sendWasmWorkerMessage({
      action: 'CALL',
      functionName: '_getSizeOfPoints',
      functionParams: []
    })
    return this.wasmWorkerMessage$.pipe(
      first(),
      map(({ value }) => value)
    );
  }

  wasmWrapperReadSurfFile(fileName: string): Observable<SurfData> {
    this.sendWasmWorkerMessage({
      action: 'CALL',
      functionName: 'wrapperReadSurfFile',
      functionParams: [`/${fileName}`]
    });
    return this.wasmWorkerMessage$.pipe(
      first(),
      map(({ value }) => value)
    );
  }

  createFile(fileName: string, fileData: Uint8Array): Observable<any> {
    this.sendWasmWorkerMessage({
      action: 'CALL',
      functionName: 'FS_createDataFile',
      functionParams: ['/', fileName, fileData, true, true]
    });
    return this.wasmWorkerMessage$.pipe(
      first()
    );
  }
}
