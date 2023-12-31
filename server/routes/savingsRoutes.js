const express = require('express');
const router = express.Router();
const Savings = require('../models/savings.js');

// Define savings-related routes here


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

router.post('/insert', async (req, res) => {
  try {

    // Extract data from the request body
    let newDocument = new Savings({
      user_id: req.body.user_id,
      goal_amount: req.body.goal_amount,
      amount_contributed: req.body.amount_contributed,
      savings_category: req.body.savings_category,
      date_created: req.body.date_created,
      completed: req.body.completed
    });
    
    let newData = await newDocument.save(); // Saving the new document in the DB
    
    res.status(201).json(newData); // Respond with the created savings record
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/delete/:categoryId', async (req, res) => {
  try {
    
    const catId = req.params.categoryId;
    console.log(catId);
    

    let result = await Savings.deleteOne({_id: catId})

    if (!result) {
      return res.status(404).json({ message: 'Element not found' });
    } 
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.put('/update/:categoryId', async (req, res) => {
  try {
    const catId = req.params.categoryId;
    const { goal_amount, amount_contributed, savings_category, completed } = req.body; 


    // Create an object representing the updates you want to make
    const updateData = {
      goal_amount,
      amount_contributed,
      savings_category,
      completed
    };

    // Use the `findOneAndUpdate` method to find and update the document by _id
    const updatedDocument = await Savings.findOneAndUpdate(
      { _id: catId },
      updateData,
      { new: true } // This option returns the updated document
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: 'Element not found' });
    }

    res.json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
