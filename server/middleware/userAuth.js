import jwt from "jsonwebtoken";
import userModel from "../model/UserModel.js";

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            if (req.originalUrl === '/api/auth/is-auth') {
                return res.status(200).json({
                    success: false,
                    message: "Not logged in"
                });
            }
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Login again."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify user exists in database
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Login again."
            });
        }
        
        req.user = { id: user._id, email: user.email || null, role: user.role };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token expired or invalid"
        });
    }
};

export default userAuth;