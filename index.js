const express = require('express');
const http = require('http');
const userRoutes = require('./routes/user.route');
const adminRoutes = require('./routes/admin.route');
const chatRoutes = require('./routes/chat.route');
const wsServer = require('./socket');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);


server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});

server.listen(5632, () => {
    console.log('Server is running on port 5632');
});
