const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  password: String,
  role: String,
  isVerified: { type: Boolean, default: false },
  emailOtp: String,
  otpExpires: Date,
  otpSentAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);