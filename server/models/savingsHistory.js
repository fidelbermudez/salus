const { response } = require('express');
const mongoose = require('mongoose');

const savingsHistorySchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true
  },
  date: String,
  timestamp: String,
  amount: Number,
  savings_category:{
    type: String
  },
  creation_date: String,
}, {collection: "savingsHistory"});

module.exports = mongoose.model('savingsHistory', savingsHistorySchema);
