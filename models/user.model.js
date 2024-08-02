const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
    mobileNumber: String,
    active: Boolean,
    role: { type: String, enum: ['student', 'professional'] },
    rollNumber: String,
    interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InterestModel' }],
    chatChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatChannelModel' }],
    companyIDCard: String, 
    approved: Boolean
});
