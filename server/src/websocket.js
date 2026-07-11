const { WebSocketServer } = require('ws');

function setupWebSocket(baseServer) {
  const wss = new WebSocketServer({ server: baseServer });
  return wss;
}

module.exports = { setupWebSocket };
