const mongoose = require('mongoose');


const budgetSummarySchema = new mongoose.Schema({
  budget_id: Number,
  user_id: Number,
  limit: Number,
  account_spent: Number,
  category_id: Number,
}, {collection: "budget"});

module.exports = mongoose.model('budget', budgetSummarySchema);