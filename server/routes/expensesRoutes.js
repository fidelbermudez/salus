const express = require('express');
const router = express.Router();
const Expenses = require('../models/expenses.js');

// Define expenses-related routes here

router.get('/all', async (req, res) => {
    try {
      const allExpenses = await Expenses.find();
      res.json(allExpenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

router.get('/show/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
  
    const expenses = await Expenses.find({ user_id: userId });
  
    if (!expenses) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
  
module.exports = router;