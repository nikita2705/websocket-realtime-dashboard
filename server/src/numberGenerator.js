const WebSocket = require('ws');
const fs = require('fs');

const HISTORY_FILE_PATH = './data/history.json';
const GENERATION_INTERVAL = 10000;
const MIN_NUMBER = 0;
const MAX_NUMBER = 100;

let previousNumber = null;
let historyArray = [];

if (fs.existsSync(HISTORY_FILE_PATH)) {
  const file = fs.readFileSync(HISTORY_FILE_PATH, 'utf8');
  historyArray = JSON.parse(file);
}

if (Array.isArray(historyArray) && historyArray.length > 0) {
  previousNumber = historyArray[historyArray.length - 1].previousNumber;
}

function startGenerating(wss) {
  setInterval(() => {
    if (previousNumber === null) {
      previousNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1) + MIN_NUMBER);
    } else {
      // Fluctuate by maximum +/- 30% from the previous number
      const ceiling = previousNumber * 1.3;
      const floor = previousNumber * 0.7;

      const finalMax = Math.min(MAX_NUMBER, ceiling);
      const finalMin = Math.max(MIN_NUMBER, floor);

      const rawNumber = Math.random() * (finalMax - finalMin) + finalMin;
      previousNumber = Number(rawNumber.toFixed(1));
    }
    const data = {
      time: new Date().toISOString(),
      previousNumber,
    };

    historyArray.push(data);

    if (historyArray.length > 15) {
      historyArray = historyArray.slice(-15);
    }

    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(historyArray));

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }, GENERATION_INTERVAL);
}

module.exports = { startGenerating };
