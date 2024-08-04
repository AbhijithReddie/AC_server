const express = require('express');
require("dotenv").config()
const http = require('http');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.route');
const adminRoutes = require('./routes/admin.route');
const chatRoutes = require('./routes/chat.route');
const wsServer = require('./socket');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});

// MongoDB connection
const dbURI = 'mongodb://localhost:27017/alumniDB';
mongoose.connect(dbURI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });
