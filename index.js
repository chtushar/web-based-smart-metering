require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const socketio = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');
const db = require('./db/setup');

const helmet = require('helmet');

const api = require('./routes/api');

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: ['https://admin.socket.io'],
  },
});

instrument(io, {
  auth: false,
  autoConnect: false,
  transports: ['websocket'],
});

const PORT = process.env.PORT || 8888;
const PUBLIC_PATH = path.join(__dirname, 'public');

const boards = db.get('boards');
const points = db.get('points');

// Middlewares
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use(express.static(PUBLIC_PATH));

app.use('/api', api);

io.on('connection', async (socket) => {
  socket.on('join', async (boardName) => {
    const board = await boards.find({ board: boardName });
    if (board.length === 0) {
      await boards.insert({
        name: boardName,
      });
    }

    const allPoints = await points.find({ board: boardName });

    socket.emit('allData', allPoints);
  });

  socket.on('add', async (boardName) => {
    let newPoint = {
      createdAt: new Date(),
      value: 0.3125,
      board: boardName,
    };

    await points.insert(newPoint);

    socket.emit('dataUpdate', newPoint);
  });
});

server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

module.exports = { io };
