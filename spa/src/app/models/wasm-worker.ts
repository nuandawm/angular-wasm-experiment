export type WasmWorkerInMessage = {
  action: 'INIT' | 'CALL',
  functionName?: string,
  functionParams?: any[]
};

export type WasmWorkerOutMessage = {
  type: 'MODULE_LOADED' | 'FUNCTION_CALLED' | 'ERROR',
  value?: any
};
