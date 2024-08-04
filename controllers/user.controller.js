const { userModel } = require('../models/user.model');
const { interestModel } = require('../models/interest.model');


exports.getProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const profile = await userModel.findById(userId).populate('interests');
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};


exports.updateProfile = async (req, res) => {
    const { userId } = req.params;
    const profileData = req.body;
    try {
        const updatedProfile = await userModel.findByIdAndUpdate(userId, profileData, { new: true });
        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(updatedProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};


exports.addInterest = async (req, res) => {
    const { userId } = req.params;
    const { interestId } = req.body;
    try {
        const interest = await interestModel.findById(interestId);
        if (!interest) {
            return res.status(404).json({ message: "Interest not found" });
        }

        const profile = await userModel.findById(userId);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        if (!profile.interests.includes(interestId)) {
            profile.interests.push(interestId);
            await profile.save();
        }

        res.status(200).json({ message: "Interest added successfully", profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};


exports.getInterests = async (req, res) => {
    const { userId } = req.params;
    try {
        const profile = await userModel.findById(userId).populate('interests');
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(profile.interests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ERROR!!!" });
    }
};
