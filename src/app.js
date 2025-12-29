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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //create a JWT token
      const token = await jwt.sign({ _id: user._id }, "dhanvin09");
      //Add the token to cookie and send the response back to the user
      res.cookie("token", token);
      res.send("Login Successfull !!");
    } else {
      throw new Error("Invalid credentials!!");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
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

//get user profile
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    //validate my token
    if (!token) {
      throw new Error("Invalid token !!");
    }
    const decodedMessage = await jwt.verify(token, "dhanvin09");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found!!");
    }
    res.send(user);
    res.send("Reading the Cookie !!");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "password"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Updates not allowed !!");
    }
    if (data?.skills?.length > 50) {
      throw new Error("Not more than 10 skills bro !!");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send(`Error message: ${err.message}`);
  }
});

app.patch("/user", async (req, res) => {
  const emailId = req.body.emailId;
  // this req.body is very harmfull , never trust it. Always use proper validators bro !!
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "password"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Updates not allowed !!");
    }
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
