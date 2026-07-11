const http = require('node:http');
const { setupWebSocket } = require('./websocket');
const { startGenerating } = require('./numberGenerator');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

const startedWss = setupWebSocket(server);
startGenerating(startedWss);

server.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${hostname}:${port}/`);
});
