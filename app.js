const express = require('express');
const expressWs = require('express-ws');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { myMiddleware, myEventEmitter } = require('./src/myMiddleware');
const { getGameList } = require('./src/utils');

const app = express();
expressWs(app);
app.use(express.static('public'));
const port = 3230;

// Use custom middleware
app.use(myMiddleware);

// Serve static files from the 'games' directory
app.use(express.static('games'));


// WebSocket route
app.ws('/ws', (ws) => {
  // Send initial data to the client
  myEventEmitter.on('message', (logMessage) => {
    console.log(`myEventEmitter "${logMessage}" `)
    ws.send(`myEventEmitter "${logMessage}" `);
  });
  // Simulate sending data periodically

  // Close the WebSocket connection
  ws.on('close', () => {
    console.log('WebSocket closed');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  getGameList();
});
