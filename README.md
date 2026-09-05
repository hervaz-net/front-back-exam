# React + Express Live Items

This repository demonstrates a simple local full‑stack app with:

- React (Vite) frontend
- Express backend
- Socket.IO for real‑time updates
- Server assigns unique UUIDs to items and broadcasts new items to connected clients

Quick start

1) Clone

   git clone https://github.com/hervaz-net/front-back-exam.git
   cd front-back-exam

2) Start server

   cd server
   npm install
   npm start

3) Start client (in a separate terminal)

   cd client
   npm install
   npm run dev

4) Open http://localhost:5173 in two browser windows/tabs. Create items in one tab — the other tab will update live.

Notes

- Server runs on port 4000 by default; client expects that. If you change the server port, update API_BASE in client/src/App.jsx and the CORS origin in server/index.js.
- This example uses an in-memory store (not persistent).
