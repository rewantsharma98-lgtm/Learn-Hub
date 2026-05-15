import jwt from "jsonwebtoken";
import userModel from "../model/UserModel.js";

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Login again."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Login again."
            });
        }

        const user = await userModel.findById(decoded.id);

        // EXTRA SECURE: Hardcoded email check + role check
        const isAuthorizedAdmin = user && 
                                 user.role === "admin" && 
                                 user.email === "rewantsharma56@gmail.com";

        if (!isAuthorizedAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access Denied. You are not authorized to access the Admin System."
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

export default adminAuth;
