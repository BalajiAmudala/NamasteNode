const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
authRouter.post("/signup", async (req, res) => {
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

    const savedUser = await user.save();
    //setting cookie after user signedUP successfully and enable him to login rightaway
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({ message: "User added successfully !!", data: savedUser });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//login API
authRouter.post("/login", async (req, res) => {
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
      res.send(user);
    } else {
      throw new Error("Invalid credentials!!");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//logout API

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("You are logged out successfully!!");
});
module.exports = authRouter;
