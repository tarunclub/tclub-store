const User = require("../models/user");
const { cookieToken } = require("../utils/cookieToken");

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
    console.log(error);
  }
};
