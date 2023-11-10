const { response } = require('express');
const mongoose = require('mongoose');

const savingsHistorySchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true
  },
  date: String,
  amount: Number,
  savings_category:{
    type: String
  },
}, {collection: "savingsHistory"});

module.exports = mongoose.model('savingsHistory', savingsHistorySchema);
