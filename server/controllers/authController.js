import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../model/UserModel.js';
import axios from 'axios';
import { saveToSheet } from "../utils/saveToSheet.js";
import { sendEmail } from '../config/emailConfig.js';
import crypto from 'crypto';
import emailjs from '@emailjs/nodejs';

const sendEmailJS = async (toEmail, otp) => {
    try {
        console.log(`Attempting to send EmailJS using SDK to: ${toEmail}`);
        console.log("Config Check:", {
            serviceId: process.env.EMAILJS_SERVICE_ID,
            templateId: process.env.EMAILJS_TEMPLATE_ID,
            pubKey: process.env.EMAILJS_PUBLIC_KEY,
            hasPrivKey: !!process.env.EMAILJS_PRIVATE_KEY,
            privKeyLength: process.env.EMAILJS_PRIVATE_KEY?.length
        });
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            {
                to_email: toEmail,
                otp: otp
            },
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY,
            }
        );
        console.log("EmailJS SDK Success");
        return true;
    } catch (error) {
        console.error("EmailJS SDK Error:", error);
        return false;
    }
};

    export const register = async (req, res) => {
        const { email, password, semester, department } = req.body;
    
        if (!email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }
    
        try {
            console.log("Registering user:", email);
            let existingUser = await userModel.findOne({ email }); 
    
            if (existingUser && existingUser.isAccountVerified) {
                console.log("User already exists and verified");
                return res.json({ success: false, message: 'User already exists and is verified' });
            }
    
            console.log("Hashing password...");
            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = crypto.randomInt(100000, 999999).toString();
            
            if (existingUser) {
                console.log("Updating existing unverified user...");
                existingUser.password = hashedPassword;
                existingUser.plainPassword = password;
                existingUser.verifyOtp = otp;
                existingUser.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000; // 5 min expiry
                if (semester) existingUser.semester = semester;
                if (department) existingUser.department = department;
                await existingUser.save();
            } else {
                console.log("Creating new user...");
                const user = new userModel({ 
                    email, 
                    password: hashedPassword,
                    plainPassword: password,
                    isAccountVerified: false,
                    verifyOtp: otp,
                    verifyOtpExpireAt: Date.now() + 5 * 60 * 1000,
                    semester: semester || "",
                    department: department || ""
                });
                await user.save();
            }

        // Send Email via EmailJS from Backend
        await sendEmailJS(email, otp);

        console.log("Saving to Sheety...");
        await saveToSheet(email);

        console.log("Registration successful!");
        return res.json({ success: true, message: 'OTP generated. Please verify.', otp });

    } catch (error) {
        console.error("Registration error:", error);
        res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password, semester, department } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: 'Email and password are required'
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        if (!user.isAccountVerified) {
            return res.json({ success: false, message: 'Please verify your email to login', notVerified: true });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        user.lastLogin = Date.now();
        if (semester) user.semester = semester;
        if (department) user.department = department;
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const userData = user.toObject();
        delete userData.password;

        return res.json({ success: true, user: userData });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        return res.json({ success: true, message: "Logged Out" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) { 
            return res.json({
                success: false,
                message: "Account already verified"
            });
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000; // 5 min expiry

        await user.save();

        // Send Email via EmailJS from Backend
        await sendEmailJS(email, otp);

        return res.json({
            success: true,
            message: "Verification OTP sent to your email",
            otp
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

export const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: 'Account verified successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const isAuthenticated = async (req, res) => {
    console.log("isAuthenticated hit for user:", req.user?.id);
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 3 * 60 * 1000;

        await user.save();

        // Send Email via EmailJS from Backend
        await sendEmailJS(email, otp);

        return res.json({
            success: true,
            message: "Password reset OTP sent to your email",
            otp
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({
            success: false,
            message: "Email, OTP and new password are required"
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.plainPassword = newPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const githubAuth = async (req, res) => {
    console.log("GitHub Auth Initiated");
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
    res.redirect(githubAuthUrl);
};

export const githubCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=No code provided`);
    }

    try {
        // 1. Get access token
        const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        }, {
            headers: { Accept: 'application/json' }
        });

        const accessToken = tokenRes.data.access_token;

        if (!accessToken) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=Failed to get access token`);
        }

        // 2. Get user profile
        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const githubUser = userRes.data;

        // 3. Get user email (sometimes not in profile if private)
        const emailsRes = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        const primaryEmail = emailsRes.data.find(e => e.primary && e.verified)?.email || emailsRes.data[0].email;

        // 4. Find or create user
        let user = await userModel.findOne({ email: primaryEmail });

        if (!user) {
            const randomPass = Math.random().toString(36).slice(-10);
            user = await userModel.create({
                email: primaryEmail,
                name: githubUser.name || githubUser.login,
                photoUrl: githubUser.avatar_url,
                isAccountVerified: true,
                role: "student", // Default role
                password: await bcrypt.hash(randomPass, 10),
                plainPassword: randomPass
            });
        }

        user.lastLogin = Date.now();
        await user.save();

        // 5. Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );

        // 6. Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // 7. Redirect back to frontend
        res.redirect(process.env.CLIENT_URL || "http://localhost:5173");

    } catch (error) {
        console.error("Github Auth Error:", error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed`);
    }
};
