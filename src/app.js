const express = require("express");
const { connectDB } = require("./config/database");
require("./config/database");

const app = express();
const User = require("./model/user");

//middlewarer to handle incoming request json data
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  //creating a new instance of the user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully !!");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
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
