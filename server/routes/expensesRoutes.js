const express = require('express');
const multer = require('multer'); // For handling file uploads
const csv = require('csv-parser'); // For parsing CSV files
const fs = require('fs'); // For working with the file system
const { Readable } = require('stream'); // For working with streams
const router = express.Router();
const Expenses = require('../models/expenses.js');

// Define expenses-related routes here

router.get('/all', async (req, res) => {
    try {
      const allExpenses = await Expenses.find();
      res.json(allExpenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

router.get('/show/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
  
    const expenses = await Expenses.find({ user_id: userId });
  
    if (!expenses) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/insert', async (req, res) => {
  try {

    // Extract data from the request body
    let newExpense = new Expenses({
      expense_id: req.body.expense_id,
      user_id: req.body.user_id,
      bank_id: req.body.bank_id,
      date: req.body.date,
      amount: req.body.amount,
      description: req.body.description,
      category_name: req.body.category_name
    });
    
    let newData = await newExpense.save();
    
    res.status(201).json(newData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/latest', async (req, res) => {
  try {
    // Find the most recent expense entry in the database and return its 'expense_id'
    const latestExpense = await Expenses.findOne({}, { expense_id: 1 }, { sort: { expense_id: -1 } });

    if (latestExpense) {
      res.json({ expense_id: latestExpense.expense_id });
    } else {
      // Handle the case where there are no expense entries in the database yet
      res.json({ expense_id: 0 });
    }
  } catch (err) {
    // Handle errors here
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a storage engine for multer to handle file uploads
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage });

router.post('/upload-expenses', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Parse the CSV data from the uploaded file
  const csvData = req.file.buffer.toString('utf8');
  const userId = req.body.user_id;
  const results = [];
  const stream = Readable.from(csvData);

  stream
    .pipe(csv())
    .on('data', (row) => {
      // Validate and process each row
      const { expenses, category, day, month, year, amount, description } = row;

      const dayWithLeadingZero = day.length === 1 ? `0${day}` : day;
      const monthWithLeadingZero = month.length === 1 ? `0${month}` : month;
      const date = `${monthWithLeadingZero}/${dayWithLeadingZero}/${year}`;

      // Basic validation example:
      if (!category || !date || !amount || !description) {
        // If any required fields are missing, skip this row or handle the error
        console.error('Skipping row due to missing data:', row);
        return;
      }

      // If all validation checks pass, you can add this row to the 'results' array
      console.log('Formatted Expense Data:', category, date, amount, description);
      results.push({ userId, category, date, amount, description });
    })
    .on('end', async () => {
      try {
        for (const expenseData of results) {
          const { category, date, amount, description } = expenseData;

          const newExpense = new Expenses({
            user_id: userId,
            category_name: category,
            date, // The date is already formatted
            amount,
            description
          });

          const savedExpense = await newExpense.save();
          if (!savedExpense) {
            console.error('Failed to save expense data:', expenseData);
          }
        }

        res.status(200).json({ message: 'Expenses data uploaded successfully.' });
      } catch (error) {
        console.error('Error during CSV data insertion:', error);
        res.status(500).json({ message: 'Server Error' });
      }
    });
});


module.exports = router;
