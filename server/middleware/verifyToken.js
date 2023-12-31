const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token not provided' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
        console.error("Error verifying token:", err);
        return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
});

};

module.exports = verifyToken;
