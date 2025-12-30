const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
//api to send connection request
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  //sending a connection request
  console.log("sending a connection request");
  res.send("connetion request sent by " + user.firstName);
});
module.exports = requestRouter;
