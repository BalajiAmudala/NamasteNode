const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dhanvi_user11:GvUkzCWmQgM6AVww@cluster0.jwmu0kg.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
