import { SurfWasmInterfaceMethod } from '../utils/wasm-interface';

export type WasmWorkerInMessage = {
  action: 'INIT'
} | {
  action: 'CALL',
  functionName: SurfWasmInterfaceMethod,
  functionParams: any[]
};

export type WasmWorkerOutMessage = {
  type: 'MODULE_LOADED' | 'ERROR'
} | {
  type: 'FUNCTION_CALLED',
  value?: any
} | {
  type: 'ERROR',
};
