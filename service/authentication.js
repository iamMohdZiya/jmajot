const jwt = require('jsonwebtoken');
const User = require('../model/user');


const createTokenForUser = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};


const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid Token');
  }
};

module.exports = {
  createTokenForUser,
  validateToken
};
