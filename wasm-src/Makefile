all: wasm_wrapper.js

wasm_wrapper.js: em_main.cpp
	emcc em_main.cpp -o ../spa/src/assets/wasm_wrapper.js \
	-lembind \
	-sWASM=1 \
	-sMODULARIZE=1 \
	-sWASM_ASYNC_COMPILATION=0 \
	-sEXPORTED_RUNTIME_METHODS=ccall,cwrap,FS_createDataFile,getValue \
	-sEXPORTED_FUNCTIONS=_getSizeOfPoints

clean:
	@echo "Cleaning"
	rm ../spa/src/assets/wasm_wrapper.js ../spa/src/assets/wasm_wrapper.wasm
