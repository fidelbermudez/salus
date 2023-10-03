const express = require('express');
const router = express.Router();
const Savings = require('../models/savings.js');

// Define savings-related routes here


router.get('/all', async (req, res) => {
  try {
    const allUsers = await Savings.find();
    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/show/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const categories = await Savings.find({ user_id: userId });
    

    if (!categories) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/report', async (req, res) => {
  try {

    const view = await Savings.find({});
    
    if (!view) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(view);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/create', async (req, res) => {
  try {
    // Extract data from the request body
    const { user_id, goal_amount, amount_contributed, savings_category } = req.body;

    // Create a new savings record
    const newSavings = new Savings({
      user_id,
      goal_amount,
      amount_contributed,
      savings_category,
    });

    // Save the new savings record to the database
    await newSavings.save();

    res.status(201).json(newSavings); // Respond with the created savings record
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('', async (req, res) => {
  try {
      // Handle POST request for submitting form data
      // Extract data from the request body
      const { user_id, goal_amount, amount_contributed, savings_category } = req.body;

      // Create a new savings record
      const newSavings = new Savings({
        user_id,
        goal_amount
        amount_contributed,
        savings_category
      });

      // Save the new savings record to the database
      await newSavings.save();

      // Redirect or respond as needed after successful submission
      res.redirect(''); // Redirect to the page or handle as required
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
}); 

router.get('/list', async (req, res) => {
  try {
    // Retrieve all entries from the "savings" collection
    const allSavings = await Savings.find({});

    // Check if there are no entries
    if (allSavings.length === 0) {
      return res.status(404).json({ message: 'No entries found' });
    }

    // Respond with the list of entries
    res.json(allSavings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
