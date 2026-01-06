const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    //Read the token from the req cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login BRO!!");
    }
    //validate the token
    const decodedObj = await jwt.verify(token, "dhanvin09");
    //Find the user
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found!!");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};

module.exports = {
  userAuth,
};
