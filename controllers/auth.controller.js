const { loginModel } = require('../models/login.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.model');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.login = async (req, res) => {
    const { identifier, password, role } = req.body;
    if (!identifier || !password || !role) {
        return res.json({ message: "Identifier, Password, and Role cannot be empty" });
    }

    try {
        let login = null;
        if (identifier.includes('@')) {
            login = await loginModel.findOne({ email: identifier, role: role });
        } else {
            login = await loginModel.findOne({ rollno: identifier, role: role });
        }

        if (!login) {
            return res.json({ message: "Login Unsuccessful" });
        }

        const originalPass = await bcrypt.compare(password, login.password);
        if (!originalPass) {
            return res.json({ message: "Login Unsuccessful" });
        }

        const user = await userModel.findOne({
            $or: [
                { email: identifier },
                { rollno: identifier }
            ]
        });

        if (!user) {
            return res.json({ message: "User not found" });
        }

        const token = await jwt.sign({ id: user._id, role: user.role }, process.env.secretkey);
        return res.status(200).json({ message: "Login Successful", token: token, role: user.role, user: user });
    } catch (err) {
        console.log(err);
        return res.json({ message: "ERROR!!!" });
    }
};

exports.signup = async (req, res) => {
    try {
        const { email, pass, username, mobile, role, rollNumber, companyCard } = req.body;
        const hashedPassword = await bcrypt.hash(pass, 10); // Hash the password before storing

        let newUser;
        if (role === 'student') {
            newUser = await userModel.create({
                email,
                password: hashedPassword,
                username,
                mobileNumber: mobile,
                role,
                rollNumber,
                companyCard,
                interests: [],
                chatChannels: [],
                approved: true,
            });

            // Create login record for the new student
            await loginModel.create({
                email,
                password: hashedPassword,
                rollno: rollNumber,
                role
            });
        } else {
            newUser = await userModel.create({
                email,
                password: hashedPassword,
                username,
                mobileNumber: mobile,
                role,
                rollNumber,
                companyCard,
                interests: [],
                chatChannels: [],
                approved: false,
            });
        }

        return res.status(200).json({ message: 'Sign Up Successful', status: true, user: newUser });
    } catch (e) {
        console.log(e);
        return res.status(404).json({ message: 'Sign Up Unsuccessful', status: false });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: 'Request Regarding Reset Password',
            html: `<b>Hello, User this is your verification OTP: ${otp}, please do not share..!</b>`,
        };

        const login = await loginModel.findOne({ email: req.body.email });

        if (!login) {
            return res.status(404).json({ status: false, Error: 'User not found' });
        }

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Mail failed!! :(', error);
                return res.status(500).json({ status: false, Error: 'ERROR in Resetting password' });
            } else {
                console.log('Mail sent to ' + mailOptions.to);
                login.otp = otp;
                await login.save();
                res.status(200).json({ status: true, message: 'OTP sent successfully' });
            }
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ status: false, Error: 'ERROR in Resetting password' });
    }
};
