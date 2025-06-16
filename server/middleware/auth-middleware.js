const jwt = require("jsonwebtoken");

// This middleware checks for the presence of a JWT in the Authorization header,

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header is missing",
        });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is missing",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid token",
        });
    }
}

module.exports = authenticate;
