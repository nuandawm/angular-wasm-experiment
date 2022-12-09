import { Injectable } from '@angular/core';

// @ts-ignore
import * as Module from '../assets/wasm_wrapper.js';
import { BehaviorSubject, filter, first, map, Observable, Subject, tap } from 'rxjs';
import { WasmWorkerInMessage, WasmWorkerOutMessage } from './models/wasm-worker';
import { SurfData } from './models/surf-data';
import { DevTools } from './utils/dev-tools';

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

  createFile(fileName: string, fileData: Uint8Array): Observable<any> {
    this.sendWasmWorkerMessage({
      action: 'CALL',
      functionName: 'createDataFile',
      functionParams: [fileName, fileData]
    });
    return this.wasmWorkerMessage$.pipe(
      first()
    );
  }

  readSurfFileMetadata(fileName: string): Observable<SurfData> {
    this.sendWasmWorkerMessage({
      action: 'CALL',
      functionName: 'readSurfFileMetadata',
      functionParams: [fileName]
    });
    return this.wasmWorkerMessage$.pipe(
      first(),
      map(result => result.type === 'FUNCTION_CALLED' ? result.value : null)
    );
  }

  readSurfDataPoints(): Observable<number> {
    this.sendWasmWorkerMessage({
      action: 'CALL',
      functionName: 'readSurfDataPoints',
      functionParams: []
    });
    return this.wasmWorkerMessage$.pipe(
      first(),
      map(result => result.type === 'FUNCTION_CALLED' ? result.value : null)
    )
  }

  readSurfDataPoints32(fileName: string, dataStart: number, totalNumberOfPoints: number): Observable<Array<number>> {
    this.sendWasmWorkerMessage({
      action: 'CALL',
      functionName: 'readSurfDataPoints32',
      functionParams: [fileName, dataStart, totalNumberOfPoints]
    });
    return this.wasmWorkerMessage$.pipe(
      first(),
      map(result => result.type === 'FUNCTION_CALLED' ? result.value : null)
    )
  }

  readSurfMatrixDataPoints32(fileName: string, dataStart: number, totalNumberOfPoints: number, xPoints: number, yPoints: number): Observable<Array<Array<number>>> {
    this.sendWasmWorkerMessage({
      action: 'CALL',
      functionName: 'readSurfMatrixDataPoints32',
      functionParams: [fileName, dataStart, totalNumberOfPoints, xPoints, yPoints]
    });
    return this.wasmWorkerMessage$.pipe(
      first(),
      map(result => result.type === 'FUNCTION_CALLED' ? result.value : null)
    )
  }
}
