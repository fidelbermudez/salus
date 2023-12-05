
const nodemailer = require('nodemailer');
require('dotenv').config();
const {PASS} = process.env;

// Generate a random 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: '316salus@gmail.com',
    pass: PASS
  }
});

// Send the 2FA code to the user's email
function send2FACode(email, code) {
  const mailOptions = {
    from: '316salus@gmail.com',
    to: email,
    subject: '2FA Code',
    text: `Your 2FA code is: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Example usage
const email = 'kelvinbueno41@gmail.com';
const code = generateCode();
send2FACode(email, code);
