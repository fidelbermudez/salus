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
  
module.exports = router;