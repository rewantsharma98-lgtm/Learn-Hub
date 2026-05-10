import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
         console.log("COOKIES:", req.cookies); // ADD THIS LINE
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

        if (!decoded?.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Login again."
            });
        }

        
        req.user = { id: decoded.id, email: decoded.email || null };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token expired or invalid"
        });
    }
};

export default userAuth;