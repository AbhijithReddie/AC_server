const { chatChannelModel } = require('../models/chatChannel.model');
const { messageModel } = require('../models/message.model');
const wsServer = require('../socket'); // Import WebSocket server

// Get all messages from a channel
exports.getMessages = async (req, res) => {
    const { channelId } = req.params;
    try {
        const channel = await chatChannelModel.findById(channelId).populate('messages');
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }
        res.status(200).json(channel.messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};

// Post a message to a channel
exports.postMessage = async (req, res) => {
    const { channelId } = req.params;
    const { sender, content } = req.body;
    try {
        const channel = await chatChannelModel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const newMessage = new messageModel({
            sender,
            content,
            channelId
        });

        await newMessage.save();
        channel.messages.push(newMessage._id);
        await channel.save();

        // Broadcast the message to all clients connected to the same channel
        wsServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client.channelId === channelId) {
                client.send(JSON.stringify({ senderId: sender, content, timestamp: new Date() }));
            }
        });

        res.status(200).json(newMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};

// Get all chat channels
exports.getChannels = async (req, res) => {
    try {
        const channels = await chatChannelModel.find();
        res.status(200).json(channels);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};
