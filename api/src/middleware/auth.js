const jwt = require('jsonwebtoken');
const { Users } = require('../db.js');
const logger = require('../logger.js');

// Will check for a valid token using the SECRET_KEY
const loginRequired = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await Users.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = loginRequired;