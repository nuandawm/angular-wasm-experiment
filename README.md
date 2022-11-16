## Compile with this

```shell
$ emcc -o ../spa/libs/em_main.js em_main.cpp -sEXPORTED_RUNTIME_METHODS=cwrap -sEXPORTED_FUNCTIONS=_read_file -sFORCE_FILESYSTEM
```
