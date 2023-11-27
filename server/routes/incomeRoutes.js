const express = require('express');
const multer = require('multer'); // For handling file uploads
const csv = require('csv-parser'); // For parsing CSV files
const fs = require('fs'); // For working with the file system
const { Readable } = require('stream'); // For working with streams
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

router.post('/insert', async (req, res) => {
  try {

    // Extract data from the request body
    let newIncome = new Income({
      income_id: req.body.income_id,
      user_id: req.body.user_id,
      bank_id: req.body.bank_id,
      date: req.body.date,
      amount: req.body.amount,
      source: req.body.source
    });
    
    let newData = await newIncome.save();
    
    res.status(201).json(newData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/latest', async (req, res) => {
  try {
    // Find the most recent expense entry in the database and return its 'expense_id'
    const latestIncome = await Income.findOne({}, { income_id: 1 }, { sort: { income_id: -1 } });

    if (latestIncome) {
      res.json({ income_id: latestIncome.income_id });
    } else {
      // Handle the case where there are no expense entries in the database yet
      res.json({ income_id: 0 });
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

router.post('/upload-income', upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Parse the CSV data from the uploaded file
  const csvData = req.file.buffer.toString('utf8');
  const userId = req.body.user_id;
  const bankId = req.body.bank_id;
  const results = [];
  const stream = Readable.from(csvData);

  try {
    const latestIncome = await Income.findOne({}, { income_id: 1 }, { sort: { income_id: -1 } });
    let latestIncomeId = latestIncome ? latestIncome.income_id : 0;

    stream
      .pipe(csv())
      .on('data', (row) => {
        const { income, source, day, month, year, amount } = row;

        const dayWithLeadingZero = day.length === 1 ? `0${day}` : day;
        const monthWithLeadingZero = month.length === 1 ? `0${month}` : month;
        const date = `${monthWithLeadingZero}/${dayWithLeadingZero}/${year}`;

        if (!source || !date || !amount ) {
          console.error('Skipping row due to missing data:', row);
          return;
        }

        const incomeData = {
          user_id: userId,
          bank_id: bankId,
          income_id: latestIncomeId + 1,
          source: source,
          date: date,
          amount: amount
        };

        console.log('Formatted Expense Data:', incomeData);
        results.push(incomeData);
        latestIncomeId++;
      })
      .on('end', async () => {
        const insertedIncome = await Income.insertMany(results);
        res.status(200).json({ message: 'Expenses data uploaded successfully.' });
      });
  } catch (error) {
    console.error('Error during CSV data insertion:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

//controller to aggregate income by month for a given year
router.get('/totals/:user_id/:year', async (req, res) => {
  try {
    const { user_id, year } = req.params;

    const totalIncome = await Income.aggregate([
      {
        $match: {
          user_id: parseInt(user_id),
          $expr: {
            $eq: [
              { $year: { $dateFromString: { dateString: "$date", format: "%m/%d/%Y" } } },
              parseInt(year)
            ]
          }
        }
      },
      {
        $project: {
          month: { $month: { $dateFromString: { dateString: "$date", format: "%m/%d/%Y" } } },
          totalAmount: "$amount"
        }
      },
      {
        $group: {
          _id: "$month",
          totalIncome: { $sum: "$totalAmount" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalIncome: 1
        }
      },
      {
        $group: {
          _id: null,
          data: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          _id: 0,
          data: {
            $map: {
              input: { $range: [1, 13] },
              as: "m",
              in: {
                $cond: [
                  { $in: ["$$m", "$data.month"] },
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$data",
                          cond: { $eq: ["$$this.month", "$$m"] }
                        }
                      },
                      0
                    ]
                  },
                  { month: "$$m", totalIncome: 0 }
                ]
              }
            }
          }
        }
      },
      {
        $unwind: "$data"
      },
      {
        $replaceRoot: { newRoot: "$data" }
      },
      {
        $project: {
          month: 1,
          totalIncome: 1
        }
      }
    ]);

    if (totalIncome.length === 0) {
      return res.status(404).json({ message: 'No income data found for the given user and year.' });
    }

    res.json(totalIncome);
  } catch (error) {
    console.error('Error fetching total income:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

  
module.exports = router;