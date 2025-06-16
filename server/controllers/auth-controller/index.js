const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../../utils/otp");
const { sendEmail } = require("../../utils/emailService");

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;
  const existingUser = await User.findOne({
    $or: [{ userName }, { userEmail }],
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

  // otp generation
  const otp = generateOTP(6);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  newUser.emailOtp = otp;
  newUser.otpExpires = otpExpiry;
  newUser.otpSentAt = new Date();
  await newUser.save();

  // send email
  const subject = "Verify your email";
  const html = `
    <p>Hello ${userName},</p>
    <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 5 minutes.</p>
    <p>If you did not request this, please ignore.</p>
  `;
  try {
    await sendEmail({ to: userEmail, subject, html });
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send verification email. Please try again later.",
    });
  }

  return res.status(201).json({
    success: true,
    message:
      "User registered successfully. Please verify your email using the OTP sent to your email.",
    data: {
      userEmail,
    },
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;
  const user = await User.findOne({ userEmail });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  if(!user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "User is not verified",
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
    { expiresIn: "2h" }
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
    },
  });
};

const verifyOtp = async(req, res) => {
    const {userEmail, otp} = req.body;
    if(!userEmail || !otp){
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required"
        })
    }

    const user = await User.findOne({userEmail});
    if(!user){
        return res.status(400).json({
            success: false,
            message: "User not found"
        })
    }

    if(user.isVerified){
        return res.status(400).json({
            success: false,
            message: "User is already verified"
        })
    }

    if(!user.emailOtp || !user.otpExpires){
        return res.status(400).json({
            success: false,
            message: "OTP not found"
        })
    }

    if(user.otpExpires < new Date()){
        return res.status(400).json({
            success: false,
            message: "OTP has expired"
        })
    }

    if(user.emailOtp !== otp){
        return res.status(400).json({
            success: false,
            message: "Invalid OTP"
        })
    }

    user.isVerified = true;
    user.emailOtp = null;
    user.otpExpires = null;
    user.otpSentAt = null;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "User verified successfully"
    })
}

const resendOtp = async(req, res) => {
    const {userEmail} = req.body;
    if(!userEmail){
        return res.status(400).json({
            success: false,
            message: "Email is required"
        })
    }

    const user = await User.findOne({userEmail});
    if(!user){
        return res.status(400).json({
            success: false,
            message: "User not found"
        })
    }
    if(user.isVerified){
        return res.status(400).json({
            success: false,
            message: "User is already verified"
        })
    }
    const now = new Date();
    const otp = generateOTP(6);
    const otpExpiry = new Date(now.getTime() + 5 * 60 * 1000);
    user.emailOtp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    // send email
    const subject = "Verify your email";
    const html = `
      <p>Hello ${user.userName},</p>
      <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
      <p>If you did not request this, please ignore.</p>
    `;
    try {
      await sendEmail({ to: userEmail, subject, html });
    } catch (err) {
      console.error("Failed to send verification email:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again later.",
      });
    }

    return res.status(200).json({
        success: true,
        message: "OTP sent successfully"
    })
}

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp
};