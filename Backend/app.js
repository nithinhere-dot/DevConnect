const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('DevConnect API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

let isConnected = false;
let memoryServer;

const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('your_atlas_connection_string_here')) {
    memoryServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = memoryServer.getUri();
  }

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    isConnected = false;
  }

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = { app, connectDB, closeDB };
