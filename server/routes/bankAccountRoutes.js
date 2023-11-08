const express = require('express');
const router = express.Router();
const BankAccount = require('../models/bankAccount');


router.get('/:userId/bankInfo', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);  
  
    const bankAccount = await BankAccount.findOne({ id: userId });
    if (!bankAccount) {
      return res.status(200).json({ hasBankAccount: false });
    }
  
    // Return the bank account details
    res.json(bankAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
  });
  


module.exports = router;
