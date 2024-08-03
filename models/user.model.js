const mongoose=require('mongoose');

const UserSchema = mongoose.Schema({
    email: String,
    password: String,
    username: String,
    mobileNumber: String,
    role: { type: String, enum: ['student', 'professional'] },
    rollNumber: String,
    interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InterestModel' }],
    chatChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatChannelModel' }],
    companyIDCard: String, 
    approved: Boolean,
    
});

const userModel=mongoose.model("user",UserSchema);
module.exports={userModel,UserSchema};