/// <reference lib="webworker" />

import { WasmWorkerOutMessage, WasmWorkerInMessage } from './models/wasm-worker';
import { createSurfWasmInterface, loadWasmModule, SurfWasmInterface, SurfWasmModule } from './utils/wasm-interface';

let surfWasmInterface: SurfWasmInterface;

addEventListener('message', ({ data }: { data: WasmWorkerInMessage }) => {
  //console.log('message', data);
  if (data.action === 'INIT') {
    const wasmModulePromise = loadWasmModule<SurfWasmModule>('assets/wasm_wrapper.wasm');
    surfWasmInterface = createSurfWasmInterface(wasmModulePromise);

    wasmModulePromise.then(module => {
      // console.log({module});
      postMessage({
        type: 'MODULE_LOADED'
      } as WasmWorkerOutMessage);
    });
  } else if (data.action === 'CALL') {
    const {functionName, functionParams} = data;
    if (surfWasmInterface && functionName && functionParams) {
      if (functionName === 'createDataFile') {
        const [fileName, fileData] = functionParams;
        surfWasmInterface.createDataFile(fileName, fileData)
          .then(() => {
            postMessage({
              type: 'FUNCTION_CALLED'
            } as WasmWorkerOutMessage);
          });
      } else if (functionName === 'readSurfFileMetadata') {
        const [fileName] = functionParams;
        surfWasmInterface.readSurfFileMetadata(fileName)
          .then(value => {
            postMessage({
              type: 'FUNCTION_CALLED',
              value
            } as WasmWorkerOutMessage);
          });
      } else if (functionName === 'readSurfDataPoints') {
        surfWasmInterface.readSurfDataPoints(5*4) // 5 * 32bit
          .then(value => {
            postMessage({
              type: 'FUNCTION_CALLED',
              value
            } as WasmWorkerOutMessage);
          });
      } else if (functionName === 'readSurfDataPoints32') {
        const [fileName, dataStart, totalNumberOfPoints] = functionParams;
        surfWasmInterface.readSurfDataPoints32(fileName, dataStart, totalNumberOfPoints)
          .then(value => {
            postMessage({
              type: 'FUNCTION_CALLED',
              value
            } as WasmWorkerOutMessage)
          })
      } else if (functionName === 'readSurfMatrixDataPoints32') {
        const [fileName, dataStart, totalNumberOfPoints, xPoints, yPoints] = functionParams;
        surfWasmInterface.readSurfMatrixDataPoints32(fileName, dataStart, totalNumberOfPoints, xPoints, yPoints)
          .then(value => {
            postMessage({
              type: 'FUNCTION_CALLED',
              value
            } as WasmWorkerOutMessage)
          })
      }
    } else {
      postMessage({
        type: 'ERROR'
      } as WasmWorkerOutMessage)
    }
  }
});
