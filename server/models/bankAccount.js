const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  account_id: Number,
  id: Number,
  bankName: String,
  accountType: String,
}, {collection: "bankAccount"});

module.exports = mongoose.model('BankAccount', bankAccountSchema);
