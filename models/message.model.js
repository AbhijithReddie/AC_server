const mongoose=require('mongoose');

const MessageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user.model' },
    content: String,
    timestamp: { type: Date, default: Date.now },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'chatchannel.model' }
});

const messageModel=mongoose.model("message",MessageSchema);
exports.module={messageModel,MessageSchema};