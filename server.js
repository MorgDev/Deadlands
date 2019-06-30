// Base Imports
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/db');

// Set up Express app
const app = express();

// Set up server port
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Set up middleware
app.use(express.json({ extended: false }));

// Set up routes
app.use('/api/users', require('./routes/api/users'));

// Set up http server
const server = http.createServer(app);

// set up socket.io server
const io = socketIO(server);

// Set up socket.io events

// Start server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));