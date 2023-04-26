import Image from 'next/image'
import { Inter } from 'next/font/google'
const express = require('express');
const app = express();
const PORT = 5173;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const inter = Inter({ subsets: ['latin'] })
const socketIO = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:3000"
  }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
 
});
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    </main>
  )
}
