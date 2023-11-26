const express = require('express');
const router = express.Router();
const BankAccount = require('../models/bankAccount');


router.get('/:userId/bankInfo', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);  
  
    const bankAccount = await BankAccount.find({ id: userId });
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
  
// DELETE route to delete a bank account
router.delete('/:userId/deleteAccount/:accountId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const accountId = parseInt(req.params.accountId);
    // Find the bank account by userId and accountId
    const bankAccount = await BankAccount.findOne({ id: userId, account_id: accountId });
    if (!bankAccount) {
      return res.status(404).json({ message: 'Bank account not found.' });
    }

    // Delete the bank account
    await BankAccount.deleteOne({ _id: bankAccount._id });

    res.status(200).json({ message: 'Bank account deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/createAccount', async (req, res) => {
  try {
      const { userId, accountDetails } = req.body; // Get data from request body

      // Construct a query to check for existing account with the same details
      const query = {
        id: userId,
        account_id: accountDetails.account_id,
        accountType: accountDetails.accountType,
        bankName: accountDetails.bankName
      };

      // Check if an account with these details already exists
      const existingAccount = await BankAccount.findOne(query);
      if (existingAccount) {
        return res.status(400).json({ message: 'Bank account already exists!' });
          
      }

      // Create a new bank account
      const newAccount = new BankAccount({
          id: userId,
          ...accountDetails // Spread operator to include all account details
      });

      // Save the new account
      await newAccount.save();

      res.status(201).json({ message: 'Bank account created successfully', account: newAccount });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
