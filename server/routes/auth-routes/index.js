const express = require('express');
const {
  registerUser, loginUser,
  verifyOtp,
  resendOtp
} = require("../../controllers/auth-controller/index");
const authenticate = require('../../middleware/auth-middleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.get('/check-auth', authenticate, (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated",
        });
    }
    return res.status(200).json({
        success: true,
        message: "User is authenticated",
        data: {
            user
        },
    });
})

module.exports = router;