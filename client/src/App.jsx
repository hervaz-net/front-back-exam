import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:4000';

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    // Fetch initial items
    fetch(`${API_BASE}/api/items`)
      .then((r) => r.json())
      .then(setItems)
      .catch((err) => console.error('fetch items error', err));

    // Connect socket
    socketRef.current = io(API_BASE);
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('connected to socket', socket.id);
    });

    socket.on('new-item', (item) => {
      // Prepend new item
      setItems((prev) => [item, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const body = { text: text.trim() };
    try {
      const res = await fetch(`${API_BASE}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Failed to create');
      setText('');
      // No need to update items here — server broadcasts via socket.
    } catch (err) {
      console.error(err);
      alert('Failed to create item');
    }
  }

  return (
    <div className="container">
      <h1>Live Items (React + Express + Socket.IO)</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Enter item text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="list">
        {items.length === 0 && <p>No items yet.</p>}
        {items.map((it) => (
          <div className="item" key={it.id}>
            <div className="item-text">{it.text}</div>
            <div className="item-meta">
              <span className="id">{it.id.slice(0, 8)}</span>{' '}
              <span className="time">{new Date(it.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
