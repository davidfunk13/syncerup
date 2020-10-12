const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const http = require('http');

app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 3001;

const server = http.createServer();

const WebSocket = require('ws').Server;

const wss = new WebSocket({ server: server });

const sessions = [];

server.on('request', app);

server.listen(PORT, () => {
    console.log(`Application server listening on port ${PORT}`);
});

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const parsed = JSON.parse(message);
        console.log(parsed);
    })
})