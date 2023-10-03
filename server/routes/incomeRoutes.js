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
  
router.get('/show/:incomeId', async (req, res) => {
    try {
      const incomeId = parseInt(req.params.incomeId);
  
      const income = await Income.findOne({ income_id: incomeId });
      console.log(incomeId, income)
  
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