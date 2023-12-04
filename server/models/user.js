const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const validator = require('validator');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email address');
      }
    }
  },
  phone_number: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false,
  },
  join_date: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    trim: true,
  },
  otpExpires: {
    type: Date,
  },
}, { collection: "users" });

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});

module.exports = mongoose.model('users', userSchema);
