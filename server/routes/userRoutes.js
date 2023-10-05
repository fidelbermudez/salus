const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Define user-related routes here

router.get('/all', async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/show/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const user = await User.findOne({ id: userId });
    console.log(userId,user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
          return res.status(401).json({ message: 'User not found' });
      }

      if (user.password === password) {
          return res.json(
          { 
          message: 'Login successful' ,
          userId: user.id,
          name: user.name
          });
      } else {
          return res.status(401).json({ message: 'Invalid credentials' });
      }
  } catch (error) {
      return res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
