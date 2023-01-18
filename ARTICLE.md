# Use a WASM module in Angular

## Compile C++ code to WASM with Emscripten

## Load the module in Vanilla JS

Spoiler: size limitation when loading a WASM module (Workers)

## Load the module in Angular

## Real-life example: read a SUR binary file

### Read metadata from the SUR file

### Return a struct containing the metadata

### Read the binary data (based on the metadata)

## Load the final WASM module: module size limitations and Workers

### Create a Worker in Angular

### Send and receive messages from the Worker

### Initial load of the WASM module inside the Worker

### Get metadata from the SUR file - Inside the Worker

### Get the binary data (based on the metadata) - Inside the Worker

## Render the binary data in a 3D scatter plot

### First try: D3.js

Spoiler: bad performance issues

### Second try: Plotly.js

Test
