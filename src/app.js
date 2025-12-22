const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({
    firstname: "Sree",
    Lastname: "Rama",
  });
});

app.post("/user", (req, res) => {
  res.send("Successfully posted the user data to DB !!!");
});

app.delete("/user", (req, res) => {
  res.send("Successfully deleted the user Data from DB !!!");
});

app.patch("/user", (req, res) => {
  res.send("Updated the user data successfully !");
});
// app.use("/hello", (req, res) => {
//   res.send("Hello hello hello !!");
// });

// app.use("/test", (req, res) => {
//   res.send("test file changes!!");
// });

// app.use("/", (req, res) => {
//   res.send("Namaste from Dashboard !!");
// });
app.listen(7777, () => {
  console.log("server is successfully listening on port 7777....");
});
