const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// In-memory store
const items = [];

/*
Item shape:
{
  id: 'uuid',
  text: 'some text',
  createdAt: 'ISO timestamp'
}
*/

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }
  const item = {
    id: uuidv4(),
    text: text.trim(),
    createdAt: new Date().toISOString()
  };
  items.unshift(item); // newest first
  // Broadcast to all connected clients
  io.emit('new-item', item);
  res.status(201).json(item);
});

io.on('connection', (socket) => {
  console.log('socket connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
