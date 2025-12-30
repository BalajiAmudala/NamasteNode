const express = require("express");
const { connectDB } = require("./config/database");
require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

//middlewarer to handle incoming request json data
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
