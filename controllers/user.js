const User = require("../models/user");
const { cookieToken } = require("../utils/cookieToken");
const { mailHelper } = require("../utils/emailHelper");
const crypto = require("crypto");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!(email || password || name)) {
      return next(new Error("All fields are required"));
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    cookieToken(user, res);
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email || password)) {
      return next(new Error("All fields are required"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new Error("User does not exists"));
    }

    if (!(await user.comparePassword(password))) {
      return next(new Error("Email or password may be wrong"));
    }

    cookieToken(user, res);
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logout successfull",
      });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new Error("Email not found as registered"));
    }

    const forgotToken = user.getForgotPasswordToken();

    await user.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${forgotToken}`;

    const message = `forgot password link is ${url}`;

    try {
      await mailHelper({
        email: user.email,
        subject: "Password reset email",
        message,
      });

      res.status(200).json({
        success: true,
        message: "email sent successfully",
      });
    } catch (error) {
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new Error(error.message));
    }
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;

    const encryToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      encryToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(new Error("Token is invalid or expired"));
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new Error("Password and confirm password do not match"));
    }

    user.password = req.body.password;

    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    cookieToken(user, res);
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("+password");

    const correctOldPassword = await user.comparePassword(req.body.oldPassword);

    if (!correctOldPassword) {
      return next(new Error("Please write correct password"));
    }

    user.password = req.body.newPassword;

    await user.save();

    cookieToken(user, res);
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.updateUserDetails = async (req, res, next) => {
  try {
    if (!(req.body.email || req.body.name)) {
      return next(new Error("Email and Name are required"));
    }

    const newData = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.adminAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.adminGetUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new Error("User does not exists"));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.adminUpdateUserDetails = async (req, res, next) => {
  try {
    if (!(req.body.email || req.body.name || req.body.role)) {
      return next(new Error("Email and Name are required"));
    }

    const newData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.adminDeleteUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new Error("User does not exists"));
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.managerAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};
