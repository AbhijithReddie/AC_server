const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ noServer: true });
wsServer.on('connection', socket => {
    socket.on('message', message => {
        // Handle incoming message
        const parsedMessage = JSON.parse(message);
        const { channelId, senderId, content } = parsedMessage;

        // Broadcast the message to all clients in the same channel
        wsServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client.channelId === channelId) {
                client.send(JSON.stringify({ senderId, content, timestamp: new Date() }));
            }
        });
    });
    socket.on('close', () => {
        // Handle socket close
    });
});
module.exports = wsServer;