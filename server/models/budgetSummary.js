const mongoose = require('mongoose');

const budgetSummarySchema = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true, 
    required: true, 
  },
  budget_id: {
    type: Number,
    unique: true, 
    required: true, 
  },
  limit: Number,
  account_spent: Number,
  category_id: Number,
}, {collection: "budget"});

module.exports = mongoose.model('budget', budgetSummarySchema);