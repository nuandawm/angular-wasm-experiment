onmessage = function(e) {
  const f = e.data[0];

  FS.mkdir('/work');
  FS.mount(WORKERFS, { files: [f] }, '/work');

  console.log(Module.read_file('/work/' + f.name));
}

self.importScripts('libs/hello.js');
