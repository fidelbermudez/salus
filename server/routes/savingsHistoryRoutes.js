const express = require('express');
const router = express.Router();
const SavingsHistory = require('../models/savingsHistory.js');


router.get('/show/:userId/:catName/:date', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const savCat = req.params.catName;
    const date = req.params.date;
    // const {c_date } = req.body;

    // console.log("test", c_date);

    // const url_date = encodeURIComponent(req.params.date);
    const creation_date = decodeURIComponent(req.params.date);
    
    // const {test, creation_date } = req.body; 
    // console.log(savCat, creation_date);

    // Find the most recent expense entry in the database and return its 'expense_id'
    const saveHistory = await SavingsHistory.find({user_id: userId, savings_category: savCat, creation_date: creation_date});

    if(!saveHistory) {
      return res.status(404).json({ message: 'Element not found' });
    }
    res.json(saveHistory);
  } catch (err) {
    // Handle errors here
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/insert', async (req, res) => {
  try {
    console.log("posting")
    // Extract data from the request body
    let newDocument = new SavingsHistory({
      user_id: parseInt(req.body.user_id),
      date: req.body.date,
      timestamp: req.body.timestamp,
      amount: parseInt(req.body.amount),
      savings_category: req.body.savings_category,
      creation_date: req.body.creation_date

    });
    
    let newData = await newDocument.save(); // Saving the new document in the DB
    
    res.status(201).json(newData); // Respond with the created savings record
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/update/:catName', async (req, res) => {
  try {
    const catName = req.params.catName;
    const {user_id, new_name, creation_date } = req.body;


    // Use the `findOneAndUpdate` method to find and update the document by _id
    const updatedDocument = await SavingsHistory.updateMany(
      { user_id: user_id, savings_category: catName, creation_date: creation_date},
      {$set: { savings_category: new_name }},
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

// route to get summary history based off year and userid
router.get('/year/:year/:userid', async (req, res) => {
  try {
    const requestedYear = parseInt(req.params.year);
    const userId = parseInt(req.params.userid);

    const saveHistory = await SavingsHistory.aggregate([
      {
        $addFields: {
          year: { $year: { $dateFromString: { dateString: '$date', format: '%m/%d/%Y' } } },
          // Convert date to ISO 8601 format for sorting purposes
          isoDate: { $dateFromString: { dateString: '$date', format: '%m/%d/%Y' } }
        }
      },
      {
        $match: { year: requestedYear, user_id: userId }
      },
      {
        $sort: { isoDate: 1 } // Sort using the newly created isoDate field
      },
      {
        $group: {
          _id: '$savings_category',
          data: {
            $push: {
              date: '$date',
              amount: '$amount'
            }
          }
        }
      }
    ]);

    if (saveHistory.length === 0) {
      return res.status(404).json({ message: 'No entries found for the specified year' });
    }

    res.json(saveHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;