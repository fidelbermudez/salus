const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  account_id: Number,
  id: Number,
  bank_name: String,
  account_type: String,
}, {collection: "bankAccount"});

module.exports = mongoose.model('BankAccount', bankAccountSchema);
