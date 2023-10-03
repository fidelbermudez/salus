const { response } = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true, 
    required: true, 
  },
  first_name: String,
  last_name: String,
  email: String,
  phone_number: String,
  password: String,
  join_date: String,
}, {collection: "users"});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model('users', userSchema);
// mongoose.model('users', userSchema).findOne({id:1}).then((response)=>{console.log(response)})