const mongoose = require("mongoose");
const validator = require("validator");

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Not a strong password:" + value);
        }
      },
    },
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
    photoUrl: {
      type: String,
      default:
        "https://images.pexels.com/photos/28271725/pexels-photo-28271725.jpeg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL:" + value);
        }
      },
    },
    about: { type: String, default: "This is a default about of USER" },
    skills: { type: [String] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
