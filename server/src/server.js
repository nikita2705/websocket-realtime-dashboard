const http = require('node:http');
const fs = require('fs');
const { setupWebSocket } = require('./websocket');
const { startGenerating } = require('./numberGenerator');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  if (req.url === '/history') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    if (fs.existsSync('./data/history.json')) {
      const fileContent = fs.readFileSync('./data/history.json', 'utf8');
      res.end(fileContent);
    } else {
      res.end('[]');
    }
  } else {
    res.statusCode = 404;
    res.end('not found');
  }
});

const startedWss = setupWebSocket(server);
startGenerating(startedWss);

server.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${hostname}:${port}/`);
});
