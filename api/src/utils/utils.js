const jwt = require('jsonwebtoken');

// consts
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SECRET_KEY = process.env.SECRET_KEY;

function validateEmail(email) {
    return emailRegex.test(email);
}

function generateToken(user) {
  // Will generate a token valid for 1 hour with the user_id, email and role
  return jwt.sign(
    { id: user.id, username: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = {
    validateEmail,
    generateToken, 
    verifyToken
};