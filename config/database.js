const mongoose = require("mongoose");
const colors = require("colors/safe");

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(console.log(colors.cyan.underline(`DATABASE CONNECTED`)))
    .catch((err) => {
      console.log(colors.red.underline("DATABASE CONNECTION FAILED"));
      console.log(err);
      process.exit(1);
    });
};
