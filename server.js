const express = require('express');

const app = express();

const server = require('http').createServer(app);

const cors = require('cors');

const io = require('socket.io')(server);

const PORT = process.env.PORT || 3001;
const corsOptions = { origin: [`http://localhost:${PORT}`], optionsSuccessStatus: 200, };
app.use(cors(corsOptions));

app.use(express.json());

io.on('connection', socket => {
    socket.emit('message', "connected")
});

server.listen(PORT, () => {
    console.log(`Application server listening on port ${PORT}`);
});

app.get('/api/testing', cors(corsOptions), function (req, res) {
    res.json({ success: true, data: "api works via ghpages with cors" })
})