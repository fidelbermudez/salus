const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
// const uri = process.env.MONGO_URI;
const app = express();
const {MONGO_URL} = process.env;
//const {MONGO_URL} = 'mongodb+srv://root:saluspassword@atlascluster.cwqn8gy.mongodb.net/development'
const port = process.env.PORT || 8081;
const userRoutes = require('./routes/userRoutes');
const bankAccountRoutes = require('./routes/bankAccountRoutes');
const savingsRoutes = require('./routes/savingsRoutes');


mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database!');
});

app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Salus');
})
app.use('/api/users', userRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/bank', bankAccountRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
