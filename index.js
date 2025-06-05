// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 3000 });

// wss.on('connection', function connection(ws) {
//   console.log('Client connected');

//   ws.on('message', function incoming(message) {
//     console.log('Received:', message);
//     ws.send(`Server received: ${message}`);
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// console.log('WebSocket server started on ws://localhost:3000');


const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3001;
const wss = new WebSocket.Server({ port });

let counter = 0;

console.log(`WebSocket server listening on port ${port}`);

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const base64String = message.toString();
    const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, '');

    const buffer = Buffer.from(base64Data, 'base64');

    const imagesDir = path.join(__dirname, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filename = `webcam_${Date.now()}_${counter++}.jpg`;
    const filePath = path.join(imagesDir, filename);

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error('Failed to save image:', err);
      } else {
        console.log(`Image saved: ${filename}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});



