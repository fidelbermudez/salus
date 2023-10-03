const express = require('express');
const router = express.Router();
const BankAccount = require('../models/bankAccount');

// Define bank account-related routes here

router.get('/:userId/bankInfo', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const bankAccount = await BankAccount.findOne({ id: userId });

    if (!bankAccount) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    res.json(bankAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
