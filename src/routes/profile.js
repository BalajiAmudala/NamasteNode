const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateEditPassword,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
//get user profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const logggedInUser = req.user;
    Object.keys(req.body).forEach(
      (key) => (logggedInUser[key] = req.body[key])
    );
    await logggedInUser.save();
    res.json({
      message: `${logggedInUser.firstName}, your profile updated successfully`,
      data: logggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    validateEditPassword(req);
    const logggedInUser = req.user;
    const updatedPassword = req.body.password;
    //encrypting the password
    const passwordHash = await bcrypt.hash(updatedPassword, 10);
    //updating the password
    logggedInUser.password = passwordHash;
    await logggedInUser.save();
    res.json({
      message: ` ${logggedInUser.firstName}, your password got updated!`,
      data: logggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = profileRouter;
