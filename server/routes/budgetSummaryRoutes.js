const express = require('express');
const router = express.Router();
const Budget = require('../models/budgetSummary.js');

// Define bank account-related routes here

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const userSummaries = await Budget.find({ user_id: userId });

    if (!userSummaries || userSummaries.length === 0) {
      return res.status(404).json({ message: 'User budget summaries not found' });
    }

    res.json(userSummaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

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