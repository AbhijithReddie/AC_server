const ChatChannelSchema = new mongoose.Schema({
    name: String,
    description: String,
    type: { type: String, enum: ['student', 'professional'] },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message.model' }]
});
