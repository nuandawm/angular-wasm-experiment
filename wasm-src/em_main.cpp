#include <stdio.h>
#include <emscripten.h>

extern "C" {

int hello(int input) {
    return input;
}

int sum(int first, int second) {
    return first + second;
}

/*int read_file(char* fileName) {
    std::fstream fs;
    fs.open("test.txt", std::fstream::in | std::fstream::binary);
    if (fs) {
        char content[6];
        fs.getline(content, 6);
        EM_ASM({
           console.log('file content', $0);
        }, content);
        fs.close();
        return 1;
    } else {
        return 0;
    }
}*/

}
