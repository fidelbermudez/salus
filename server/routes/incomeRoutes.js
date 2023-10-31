const express = require('express');
const router = express.Router();
const Income = require('../models/income.js');

// Define income-related routes here

router.get('/all', async (req, res) => {
    try {
      const allIncome = await Income.find();
      res.json(allIncome);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
router.get('/show/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
  
    const income = await Income.find({ user_id: userId });
  
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
}
  
    res.json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/insert', async (req, res) => {
  try {

    // Extract data from the request body
    let newIncome = new Income({
      income_id: req.body.income_id,
      user_id: req.body.user_id,
      bank_id: req.body.bank_id,
      date: req.body.date,
      amount: req.body.amount,
      source: req.body.source
    });
    
    let newData = await newIncome.save();
    
    res.status(201).json(newData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/latest', async (req, res) => {
  try {
    // Find the most recent expense entry in the database and return its 'expense_id'
    const latestIncome = await Income.findOne({}, { income_id: 1 }, { sort: { income_id: -1 } });

    if (latestIncome) {
      res.json({ income_id: latestIncome.income_id });
    } else {
      // Handle the case where there are no expense entries in the database yet
      res.json({ income_id: 0 });
    }
  } catch (err) {
    // Handle errors here
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
module.exports = router;