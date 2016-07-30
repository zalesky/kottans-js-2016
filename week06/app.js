const http = require('http');

class App {

  constructor() {
    this.serverStack = []
  }

  use() {
    this.serverStack = this.serverStack.concat([].slice.call(arguments))
  }

  start(port, host, callback) {
    http.createServer((req, res) => {
      let length = this.serverStack.length;
      let i = 0;
      for (; i < length; i += 1) {
        this.serverStack[i](req, res)
      }
    }).listen(port, host);
    callback();
  }
}

module.exports = new App();