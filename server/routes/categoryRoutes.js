const express = require('express');
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


module.exports = router;
