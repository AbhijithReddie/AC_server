const { loginModel } = require('../models/login.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.model');
const nodemailer = require('nodemailer');

exports.login = async (req, res) => {
    const { identifier, password, role } = req.body;
    if (!identifier || !password || !role) {
        return res.json({ message: "Identifier, Password, and Role cannot be empty" });
    }

    try {
        let login;
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
    // Signup logic here
};

exports.forgotPassword = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'medworlddummy@gmail.com',
                pass: 'unuh bmxl pmec ybvh'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const mailOptions = {
            from: 'medworlddummy@gmail.com',
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
