import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const socket = io(backendUrl);

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    axios.get(`${backendUrl}/api/notes`).then((response) => {
      setNotes(response.data);
    });

    socket.on('note', (newNote) => {
      setNotes((prevNotes) => [...prevNotes, newNote]);
    });

    return () => {
      socket.off('note');
    };
  }, []);

  const addNote = () => {
    axios.post(`${backendUrl}/api/notes`, { content: note }).then((response) => {
      setNote('');
    });
  };

  return (
    <div>
      <h1>Collaborative Notes</h1>
      <textarea value={note} onChange={(e) => setNote(e.target.value)}></textarea>
      <button onClick={addNote}>Add Note</button>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>{note.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
