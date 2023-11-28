const express = require('express');
const multer = require('multer'); // For handling file uploads
const csv = require('csv-parser'); // For parsing CSV files
const fs = require('fs'); // For working with the file system
const { Readable } = require('stream'); // For working with streams
const router = express.Router();
const categories = require('../models/category.js');
 
// Define expenses-related routes here
 
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
 
    const userSummaries = await categories.find({ user: userId }).sort({ year: 1, month: 1 });
 
    if (!userSummaries || userSummaries.length === 0) {
      return res.status(404).json({ message: 'User categories summary not found' });
    }
 
    res.json(userSummaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user/:userId/:year', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const year = parseInt(req.params.year);

    const userSummaries = await categories.find({ user: userId, year: year});

    if (!userSummaries || userSummaries.length === 0) {
      return res.status(404).json({ message: 'User categories summary not found' });
    }

    res.json(userSummaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user/:userId/:year/:month', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    const userSummaries = await categories.find({ user: userId, year: year, month: month}).sort({ year: 1, month: 1 });

    if (!userSummaries || userSummaries.length === 0) {
      return res.status(404).json({ message: 'User categories summary not found' });
    }

    res.json(userSummaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/incrementAmount', async (req, res) => {
  try {
    // Extract the criteria and increment value from the request body
    const { user, year, month, category_name } = req.body;
    const incrementAmount = req.body.incrementAmount;
 
    // Convert month to a number (e.g., "06" to 6)
    const numericMonth = parseInt(month, 10);
 
    // Define the query to find the document to update
    const query = {
      user,
      year,
      month: numericMonth,
      category_name
    };
 
    // Define the update to increment the amount_spent value
    const update = {
      $inc: { amount_spent: incrementAmount }
    };
 
    // Use findOneAndUpdate to find and update the document that matches the criteria
    const updatedDocument = await categories.findOneAndUpdate(query, update, { new: true });
 
    if (updatedDocument) {
      res.json({ message: 'Amount spent incremented successfully.', updatedDocument });
    } else {
      res.status(404).json({ message: 'Document not found or not updated.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const upload = multer();
router.put('/incrementAmountCsv', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Parse the CSV data from the uploaded file
    const csvData = req.file.buffer.toString('utf8');
    const userId = req.body.user_id;
    const results = [];
    const stream = Readable.from(csvData);

    // Parse CSV data using 'csv-parser' library
    stream.pipe(csv())
      .on('data', (row) => {
        const { expenses, category, day, month, year, amount, description } = row;

        // Convert month to a number (e.g., "06" to 6)
        const numericMonth = parseInt(month, 10);

        // Define the query to find the document to update
        const query = {
          user: userId,
          year,
          month: numericMonth,
          category_name: category
        };

        // Define the update to increment the amount_spent value
        const update = {
          $inc: { amount_spent: amount }
        };

        // Use findOneAndUpdate to find and update the document that matches the criteria
        results.push(categories.findOneAndUpdate(query, update));
      })
      .on('end', async () => {
        // Wait for all findOneAndUpdate promises to resolve
        const updatedDocuments = await Promise.all(results);

        res.json({ message: 'Budgets updated successfully from CSV.', updatedDocuments });
      });
  } catch (error) {
    console.error('Error during CSV data update:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
 
//POST request used to send a new budget to the DB from the client-side
router.post('/insert', async (req, res) => {
  try {
    // Extract data from the request body
    let newBudget = new categories({
      month: req.body.month,
      year: req.body.year,
      user: req.body.user,
      category_name: req.body.category_name,
      amount_spent: req.body.amount_spent,
      limit: req.body.limit
    });
    
    let newData = await newBudget.save(); // Save the new document in the DB
  
    res.status(201).json(newData); // Respond with the created budget
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
 
 
 
////DELETE request used to delete a budget on the client side and that is reflected on the mongoleDB
router.delete('/delete/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    console.log(categoryId);
 
    //needed to change category.deleteOne to categories.deleteOne for it to finally work
    let result = await categories.deleteOne({_id: categoryId})
 
    if (!result) {
      return res.status(404).json({ message: 'Element not found' });
    }
    //window.location.reload();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
 
module.exports = router;
 