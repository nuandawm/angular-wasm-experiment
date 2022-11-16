const readFile = Module.cwrap('read_file', "number", ["string"]);

const fileInputElement = document.getElementById('fileInput')
let dataInt8;
fileInputElement.addEventListener('change', function () {
  const [file] = this.files;
  file.arrayBuffer().then(data => {
    dataInt8 = new Uint8Array(data);
    FS.createDataFile('/', file.name, dataInt8, true, true);
    console.log('read file', readFile(file.name));
  });
}, false)
