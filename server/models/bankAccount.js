const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  id: Number,
  bank_name: String,
  account_type: String,
});

module.exports = mongoose.model('BankAccount', bankAccountSchema);
