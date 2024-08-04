const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    personalInfo: {
        fullName: { type: String, required: true },
        profilePicture: { type: String },
        coverPhoto: { type: String },
        dateOfBirth: { type: Date },
        gender: { type: String },
        bio: { type: String },
        contact: {
            email: { type: String, required: true },
            phone: { type: String },
            address: { type: String },
            socialMedia: {
                linkedin: { type: String },
                twitter: { type: String },
                facebook: { type: String },
                instagram: { type: String }
            }
        }
    },
    academicInfo: {
        rollNumber: { type: String, required: true },
        enrollmentYear: { type: Number },
        graduationYear: { type: Number },
        degree: { type: String },
        major: { type: String },
        gpa: { type: Number },
        achievements: [String],
        projects: [String],
        courses: [String]
    }
}, { timestamps: true });

const ProfileModel = mongoose.model("Profile", ProfileSchema);

module.exports = { ProfileModel, ProfileSchema };
