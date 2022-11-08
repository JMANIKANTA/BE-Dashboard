require("dotenv").config();
require("./config/database").connect();
const cors = require("cors");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());

const User = require("./model/user");

app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, first_name, last_name } = req.body;

    if (!(email && password && first_name && last_name)) {
      console.log("All fields are required");
      res.status(400).send("All fields are required");
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      console.log("User Already Exist. Please Login");
      return res.status(409).send("User Already Exist. Please Login");
    }
    passwordEncry = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: passwordEncry,
    });
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    user.token = token;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    if (!(email && password)) {
      console.log("All fields are required");
      res.status(400).send("All fields are required");
    }

    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      console.log("No such user exists, Please register");
      res.status(404).send("No such user exists, Please register");
    }

    if (oldUser && (await bcrypt.compare(password, oldUser.password))) {
      const token = jwt.sign(
        { user_id: oldUser._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
      oldUser.token = token;
      res.status(200).json(oldUser);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
