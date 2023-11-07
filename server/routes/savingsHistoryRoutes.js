const express = require('express');
const router = express.Router();
const SavingsHistory = require('../models/savingsHistory.js');


router.get('/show/:userId/:catName', async (req, res) => {
  try {

    const userId = parseInt(req.params.userId);
    const savCat = req.params.catName;

    // Find the most recent expense entry in the database and return its 'expense_id'
    const saveHistory = await SavingsHistory.find({user_id: userId, savings_category: savCat});

    if(saveHistory.length === 0) {
      return res.status(404).json({ message: 'Element not found' });
    }
    res.json(saveHistory);
  } catch (err) {
    // Handle errors here
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/disp/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
  
    const expenses = await SavingsHistory.find({ savings_category: userId });
    console.log(userId);
  
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