const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;
const verifyToken = require('../middleware/verifyToken');


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
      
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
          return res.status(401).json({ message: 'User not found' });
      }
      if (!password || !user.password) {

        return res.status(400).json({ message: 'Bad Request' });
    }    
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
          return res.json(
              {
                  message: 'Login successful',
                  userId: user.id,
                  name: user.first_name,
                  token: token
              }
          );
      } else {
          return res.status(401).json({ message: 'Invalid credentials' });
      }
  } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
    });

    console.log('User ID from token:', userId);
    console.log('User data fetched:', user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/signup', async (req, res) => {
  const { email, password, first_name, last_name, phone_number } = req.body;
  console.log(req.body)

  const existingUser = await User.findOne({ email });
  if (existingUser) {
      return res.status(400).send({ message: 'Email already in use.' });
  }

  const plainPassword = password;
  const lastUser = await User.findOne().sort('-id');
  const newUserId = lastUser && lastUser.id ? lastUser.id + 1 : 21;

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}
  const newUser = new User({
      id: newUserId,
      first_name,
      last_name, 
      email,
      phone_number,
      password: plainPassword,
      join_date: formatDate(new Date())
  });

  try {
      await newUser.save();
      res.status(201).send({ message: 'User registered successfully', id: newUserId });
  } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).send({ message: 'Error registering user' });
  }
});



module.exports = router;
