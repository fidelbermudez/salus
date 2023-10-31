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

router.post('/insert', async (req, res) => {
  try {

    // Extract data from the request body
    let newExpense = new Expenses({
      expense_id: req.body.expense_id,
      user_id: req.body.user_id,
      bank_id: req.body.bank_id,
      date: req.body.date,
      amount: req.body.amount,
      description: req.body.description,
      category_name: req.body.category_name
    });
    
    let newData = await newExpense.save();
    
    res.status(201).json(newData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/latest', async (req, res) => {
  try {
    // Find the most recent expense entry in the database and return its 'expense_id'
    const latestExpense = await Expenses.findOne({}, { expense_id: 1 }, { sort: { expense_id: -1 } });

    if (latestExpense) {
      res.json({ expense_id: latestExpense.expense_id });
    } else {
      // Handle the case where there are no expense entries in the database yet
      res.json({ expense_id: 0 });
    }
  } catch (err) {
    // Handle errors here
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;