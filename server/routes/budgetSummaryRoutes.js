const express = require('express');
const router = express.Router();
const Budget = require('../models/budgetSummary.js');

// Define bank account-related routes here

router.get('/show/:budgetId', async (req, res) => {
  try {
    const budgetId = parseInt(req.params.budgetId);
    
    const budgetSummary = await Budget.findOne({ budget_id: budgetId });

    if (!budgetSummary) {
      return res.status(404).json({ message: 'Budget Summary not found' });
    }

    res.json(budgetSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;