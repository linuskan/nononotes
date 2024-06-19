const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://linuskan:Cami55a44@notetaking.5r4zohi.mongodb.net/?retryWrites=true&w=majority&appName=notetaking';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const noteSchema = new mongoose.Schema({ content: String });
const Note = mongoose.model('Note', noteSchema);

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
  const note = new Note({
    content: req.body.content,
  });
  await note.save();
  io.emit('note', note);
  res.status(201).json(note);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
