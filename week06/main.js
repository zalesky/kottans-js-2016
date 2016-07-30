const app = require('./app');
const config = require('config').Server;

app.use((req, res)  => {
  console.log("url", req.url);
  console.log("method", req.method);
})
app.use((req, res) => {
  console.log(req.headers);
  res.end("Hello World");
})
app.start(config.host, config.port, , () => console.log("listening on " + config.port))