const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("FirstName should be 4-58 character.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("emailId is not valid!!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong. Please enter strong pasword!!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const validateEditPassword = (req) => {
  const allowedField = "password";
  const updatedPassword = req.body.password;
  // if (req.body[key] !== allowedField) {
  //   throw new Error("Only passwords are editable!!");
  // }
  if (!validator.isStrongPassword(updatedPassword)) {
    throw new Error("password is not strong. Please enter strong pasword!!");
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateEditPassword,
};
