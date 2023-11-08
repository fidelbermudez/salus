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

router.post('/insert', async (req, res) => {
  try {
    console.log("posting")
    // Extract data from the request body
    let newDocument = new SavingsHistory({
      user_id: parseInt(req.body.user_id),
      date: req.body.date,
      amount: parseInt(req.body.amount),
      savings_category: req.body.savings_category
    });
    
    let newData = await newDocument.save(); // Saving the new document in the DB
    
    res.status(201).json(newData); // Respond with the created savings record
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;