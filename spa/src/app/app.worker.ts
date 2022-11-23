/// <reference lib="webworker" />

// @ts-ignore
import * as Module from '../assets/wasm_wrapper.js';
import { WasmWorkerOutMessage, WasmWorkerInMessage } from './models/wasm-worker';

let workerModule: any;

addEventListener('message', ({ data }: { data: WasmWorkerInMessage }) => {
  //console.log('message', data);
  if (data.action === 'INIT') {
    fetch('assets/wasm_wrapper.wasm')
      .then(response => response.arrayBuffer())
      .then(buffer => new Uint8Array(buffer))
      .then(binary => Module({
        wasmBinary: binary
      }))
      .then(function(module) {
        workerModule = module;
        //console.log({ module });
        postMessage({
          type: 'MODULE_LOADED'
        } as WasmWorkerOutMessage);
      });
  } else if (data.action === 'CALL') {
    const {functionName, functionParams} = data;
    if (workerModule && functionName && functionParams) {
      let value;
      if (functionName !== 'FS_createDataFile') {
        value = workerModule[functionName].call(this, ...functionParams)
      } else {
        workerModule[functionName].call(this, ...functionParams);
      }

      postMessage({
        type: 'FUNCTION_CALLED',
        value
      } as WasmWorkerOutMessage);
    } else {
      postMessage({
        type: 'ERROR'
      } as WasmWorkerOutMessage)
    }
  }
});
