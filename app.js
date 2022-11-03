require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const app = express();

// imports
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// routes
const home = require("./routes/home");
const user = require("./routes/user");

app.use("/api/v1", home);
app.use("/api/v1", user);

module.exports = app;
