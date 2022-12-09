// @ts-ignore
import * as Module from '../../assets/wasm_wrapper.js';
import { SurfData } from '../models/surf-data';

export type SurfWasmModule = {
  _malloc: (size: number) => any,
  ccall: () => any,
  cwrap: () => any,
  FS_createDataFile: (filePath: string, fileName: string, fileData: Uint8Array, a: boolean, b: boolean) => void,
  getValue: (ptr: number, ptrType: string) => any,
  wrapperReadSurfFile: (filePath: string) => SurfData,
  wrapperReadSurfDataPoints: (ptr: number) => void,
  wrapperReadSurfDataPoints32: (filePath: string, dataStart: number, dataPtr: number, totalNumberOfPoints: number) => void
}

export type SurfWasmInterface = {
  createDataFile: (fileName: string, fileData: Uint8Array) => PromiseLike<void>,
  readSurfFileMetadata: (fileName: string) => PromiseLike<SurfData>,
  readSurfDataPoints: (dataSize: number) => PromiseLike<number>,
  readSurfDataPoints32: (fileName: string, dataStart: number, totalNumberOfPoints: number) => PromiseLike<Array<number>>,
  readSurfMatrixDataPoints32: (fileName: string, dataStart: number, totalNumberOfPoints: number, xPoints: number, yPoints: number) => PromiseLike<Array<Array<number>>>,
}

export type SurfWasmInterfaceMethod = keyof SurfWasmInterface;

export function loadWasmModule<ModuleType>(path: string): PromiseLike<ModuleType> {
  return fetch(path)
    .then(response => response.arrayBuffer())
    .then(buffer => new Uint8Array(buffer))
    .then(binary => Module({
      wasmBinary: binary
    }));
}

export function createSurfWasmInterface(modulePromise: PromiseLike<SurfWasmModule>): SurfWasmInterface {
  return {
    createDataFile: (fileName: string, fileData: Uint8Array) => {
      // TODO overwrite file if already exists
      return modulePromise
        .then(module => module.FS_createDataFile('/', fileName, fileData, true, true))
    },
    readSurfFileMetadata: (fileName: string): PromiseLike<SurfData> => {
      return modulePromise
        .then(module => module.wrapperReadSurfFile(`/${fileName}`));
    },
    readSurfDataPoints: (dataSize: number): PromiseLike<number> => {
      return modulePromise.then(module => {
        const arrayPtr = module._malloc(dataSize);
        module.wrapperReadSurfDataPoints(arrayPtr);
        return module.getValue(arrayPtr, 'i32');
      });
    },
    readSurfDataPoints32: (fileName, dataStart, totalNumberOfPoints) => {
      return modulePromise.then(module => {
        const arrayPtr = module._malloc(totalNumberOfPoints * 4); // totalNumberOfPoints * 32bit
        module.wrapperReadSurfDataPoints32(`/${fileName}`, dataStart, arrayPtr, totalNumberOfPoints);
        // TODO free allocated memory
        return Array.from({length: totalNumberOfPoints},
          (_, index) => module.getValue(arrayPtr + index * 4, 'i32'));
      })
    },
    readSurfMatrixDataPoints32: (fileName, dataStart, totalNumberOfPoints, xPoints, yPoints) => {
      return modulePromise.then(module => {
        const arrayPtr = module._malloc(totalNumberOfPoints * 4); // totalNumberOfPoints * 32bit
        module.wrapperReadSurfDataPoints32(`/${fileName}`, dataStart, arrayPtr, totalNumberOfPoints);
        // Empty matrix
        const dataMatrix: Array<Array<number>> = Array.from({length: yPoints}, () => []);
        for (let i=0; i<totalNumberOfPoints; i++) {
          dataMatrix[Math.floor(i / xPoints)][i % xPoints] = module.getValue(arrayPtr + i * 4, 'i32');
        }
        // TODO free allocated memory
        return dataMatrix;
      })
    }
  }
}
