const express = require("express");
const { connectDB } = require("./config/database");
require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const app = express();
const User = require("./model/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const { get } = require("mongoose");

//middlewarer to handle incoming request json data
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);
    //Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    //creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully !!");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//login API
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Please enter valid emailId !!");
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials !!");
    }
    const isPasswordValid = await user.getValidatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      //Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });
      res.send("Login Successfull !!");
    } else {
      throw new Error("Invalid credentials!!");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//get user profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//api to send connection request
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  //sending a connection request
  console.log("sending a connection request");
  res.send("connetion request sent by " + user.firstName);
});

connectDB()
  .then(() => {
    console.log("Database connection was successfull !");
    app.listen(7777, () => {
      console.log("server is successfully listening on port 7777....");
    });
  })
  .catch((err) => {
    console.error("DB connection is unsuccessfull!");
  });
