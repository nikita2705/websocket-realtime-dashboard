const WebSocket = require('ws');
const fs = require('fs');

let previousNumber = null;
const minNumber = 0;
const maxNumber = 100;
let historyArray = [];
if (!fs.existsSync('./data/history.json')) {
  historyArray = [];
} else {
  const file = fs.readFileSync('./data/history.json', 'utf8');
  historyArray = JSON.parse(file);
}
if (Array.isArray(historyArray) && historyArray.length > 0) {
  previousNumber = historyArray[historyArray.length - 1].previousNumber;
}

function startGenerating(wss) {
  setInterval(() => {
    if (previousNumber === null) {
      previousNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
    } else {
      // Fluctuate by maximum +/- 30% from the previous number
      const ceiling = previousNumber * 1.3;
      const floor = previousNumber * 0.7;

      const finalMax = Math.min(maxNumber, ceiling);
      const finalMin = Math.max(minNumber, floor);

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

    fs.writeFileSync('./data/history.json', JSON.stringify(historyArray));

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }, 10000);
}

module.exports = { startGenerating };
