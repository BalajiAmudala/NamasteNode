const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Namaste from Dashboard !!");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello !!");
});

app.use("/test", (req, res) => {
  res.send("test file changes!!");
});

app.listen(7777, () => {
  console.log("server is successfully listening on port 7777....");
});
