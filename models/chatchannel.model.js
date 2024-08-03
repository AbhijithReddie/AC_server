const mongoose=require('mongoose');

const ChatChannelSchema = mongoose.Schema({
    name: String,
    description: String,
    type: { type: String, enum: ['student', 'professional'] },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message.model' }]
});

const chatChannelModel=mongoose.model("chatChannel",ChatChannelSchema);
module.exports={chatChannelModel,ChatChannelSchema};