const express = require('express');
const router = express.Router();
const budget = require('../models/budgetSummary');

// Define bank account-related routes here

router.get('/all', async (req, res) => {
  try {
    //const budgetId = parseInt(req.params.budgetId);
    const budgetSummary = await budget.find({});


    if (!budgetSummary) {
      return res.status(404).json({ message: 'Budget Summary not found' });
    }

    res.json(budgetSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/budget/:budgetId', async (req, res) => {
    try {
      const budgetId = parseInt(req.params.budgetId);
      const budgetSummary = await budget.findOne({ budget_id: budgetId });
  
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