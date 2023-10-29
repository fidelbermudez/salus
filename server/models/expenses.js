const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    expense_id: Number,
    user_id: Number,
    bank_id: Number,
    date: String,
    amount: Number,
    category_name: String,
    description: String
}, {collection: "expenses"});

module.exports = mongoose.model('expenses', expenseSchema);