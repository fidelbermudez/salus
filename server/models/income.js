const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    income_id: Number,
    user_id: Number,
    bank_id: Number,
    date: String,
    amount: Number,
    source: String
}, {collection: "income"});

module.exports = mongoose.model('income', incomeSchema);