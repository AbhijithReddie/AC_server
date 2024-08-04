const { loginModel } = require('../models/login.model');
const { userModel } = require('../models/user.model');
const { messageModel } = require('../models/message.model');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};

// Add alumni
exports.addAlumni = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== 'alumni') {
            return res.status(400).json({ message: "User is not an alumni" });
        }

        // Set approved to true
        user.approved = true;
        await user.save();

        // Add entry to login model
        const newLogin = new loginModel({ email: user.email, password: user.password, rollno: user.rollNumber, role: user.role });
        await newLogin.save();

        res.status(200).json({ message: "Alumni added successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};

// Delete alumni
exports.deleteAlumni = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
    }

    try {
        const user = await userModel.findByIdAndRemove(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await loginModel.findOneAndRemove({ email: user.email });

        res.status(200).json({ message: "Alumni deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
    }

    try {
        const user = await userModel.findByIdAndRemove(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await loginModel.findOneAndRemove({ email: user.email });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};

// Delete message
exports.deletePost = async (req, res) => {
    const { messageId } = req.body;
    if (!messageId) {
        return res.status(400).json({ message: "MessageId is required" });
    }

    try {
        const message = await messageModel.findByIdAndRemove(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};
