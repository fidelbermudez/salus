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
      savings_category: req.body.savings_category
    });
    
    let newData = await newDocument.save(); // Saving the new document in the DB
    
    res.status(201).json(newData); // Respond with the created savings record
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/delete/:categoryId', async (req, res) => {
  try {
    
    const catId = req.params.categoryId;
    console.log(catId);
    // const result = await Savings.find({ _id: catId});

    let result = await Savings.deleteOne({_id: catId})

    // if (result.deletedCount === 1){
    //   res.status(200).json({ message: 'Element deleted successfully' });
    // } else {
    //   res.status(404).json({ message: 'Element not found' });
    // } 

    // res.status(200).json({ message: 'Element deleted successfully' });
    if (!result) {
      return res.status(404).json({ message: 'Element not found' });
    } 
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// router.get('/del/:catId', async (req, res) => {
//   try {
//     const catId = req.params.catId;

//     const categories = await Savings.find({ _id: catId});
    

//     if (!categories) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(categories);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


module.exports = router;

//  db.savings('users').deleteOne({ _id: ObjectId(id) })
//     .then(() => {
//       res.status(200).send('Document deleted');
//     })
//     .catch(err => {
//       res.status(500).send(err);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });