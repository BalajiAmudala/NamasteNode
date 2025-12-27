const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dhanvi_user11:x73BMY24ZQG5REHK@cluster0.jwmu0kg.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
