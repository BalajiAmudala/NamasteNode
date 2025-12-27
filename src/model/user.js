const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: { type: String, required: true, trim: true },
    age: {
      type: Number,
      trim: true,
      validate(value) {
        if (value < 18) {
          throw Error("Not the right age bro!!!");
        }
      },
    },
    gender: { type: String, trim: true },
    photoUrl: { type: String },
    about: { type: String, default: "This is a default about of USER" },
    skills: { type: [String] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
