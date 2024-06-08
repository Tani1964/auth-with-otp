const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticator } = require('otplib');
const nodemailer = require('nodemailer');

const secret = process.env.JWT_SECRET; // Use a strong secret for JWT

const app = express();
app.use(bodyParser.json());

// Mock database
let users = {};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASS, // Use an app password if using Gmail
    },
});

// Register Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword, verified: false };
    res.json({ message: 'User registered successfully' });
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    const otp = authenticator.generate(secret);
    user.otp = otp;
    console.log(`Generated OTP for ${username}: ${otp}`);

    // Send OTP to user's email
    const mailOptions = {
        from: process.env.APP_EMAIL,
        to: user.email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };
    
    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error sending OTP' });
            }
            console.log('Email sent: ' + info.response);
            res.json({ message: 'OTP sent to email' });
        });
    } catch (error) {
        console.log(error)
    }
    
});

// Verify OTP Route
app.post('/verify', (req, res) => {
    const { username, otp } = req.body;
    const user = users[username];
    if (!user) {
        return res.status(400).json({ message: 'Invalid username' });
    }
    
    const isValid = authenticator.check(otp, secret);
    if (!isValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
