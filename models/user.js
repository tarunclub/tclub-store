const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [40, "40 characters max"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      validate: [validator.isEmail, "Email is not in correct format"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: [6, "password should be atleast 6 characters"],
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// JWT Token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// generate forgot password token
userSchema.methods.getForgotPasswordToken = function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  this.forgotPasswordExpiry =
    Date.now() + process.env.FORGOT_PASSWORD_EXPIRY_TIME * 60 * 1000;

  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
