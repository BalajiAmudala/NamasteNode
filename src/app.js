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
//get user by firstname
// app.get("/user", async (req, res) => {
//   const userFirstName = req.body.firstName;
//   console.log(userFirstName);
//   try {
//     const user = await User.find({ firstName: userFirstName });
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("something went wrong!!");
//   }
// });

//get user by email
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const users = await User.find({ emailId: userEmail });
//     if (users.length === 0) {
//       res.status(404).send("user not found!!");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(400).send("something went wrong!!");
//   }
// });

//get userOne by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmail });
    if (!users) {
      res.status(404).send("user not found!!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong!!");
  }
});

//Feed API - GET /feed - get all the users from the DB
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong!!");
  }
});

//delete user API
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findOneAndDelete({ _id: userId });
    res.send("user is deleted sucessfully !!");
  } catch (err) {
    res.status(400).send("something went wrong!!");
  }
});

//update the data of the users
// app.patch("/user", async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;
//   try {
//     await User.findByIdAndUpdate({ _id: userId }, data);
//     res.send("user updated successfully");
//   } catch (err) {
//     res.status(400).send("something went wrong!!");
//   }
// });

app.patch("/user", async (req, res) => {
  const emailId = req.body.emailId;
  console.log(emailId);
  const data = req.body;
  console.log(data);
  try {
    await User.findOneAndUpdate({ emailId: emailId }, data);
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("something went wrong!!");
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
