const { response } = require('express');
const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true
  },
  goal_amount: Number,
  amount_contributed: Number,
  savings_category:{
    type: String,
    required: true
  },
  date_created: {
    type: String,
    required: true
  },
  completed: Number
}, {collection: "savings"});

module.exports = mongoose.model('savings', savingsSchema);
// mongoose.model('users', userSchema).findOne({id:1}).then((response)=>{console.log(response)})