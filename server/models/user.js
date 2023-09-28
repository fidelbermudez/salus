const { response } = require('express');
const mongoose = require('mongoose');

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

module.exports = mongoose.model('users', userSchema);
// mongoose.model('users', userSchema).findOne({id:1}).then((response)=>{console.log(response)})