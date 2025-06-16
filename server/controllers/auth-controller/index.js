const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const {userName, userEmail, password, role} = req.body;
    const existingUser = await User.findOne({
        $or: [{userName}, {userEmail}],
    });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User with this username or email already exists",
        });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        userName,
        userEmail,
        role,
        password: hashPassword,
    });
    await newUser.save();
    return res.status(201).json({
        success: true,
        message: "User registered successfully",
    });
}

const loginUser = async (req, res) => {
    const {userEmail, password} = req.body;
    const user = await User.findOne({userEmail});
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User not found",
        });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid password",
        });
    }

    const accessToken = jwt.sign(
        {
            userId: user._id,
            userName: user.userName,
            userEmail: user.userEmail,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {expiresIn: "2h"}
    );
    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken,
            user: {
                userId: user._id,
                userName: user.userName,
                userEmail: user.userEmail,
                role: user.role,
            },
        }
    });
}

module.exports = {
    registerUser, loginUser
};