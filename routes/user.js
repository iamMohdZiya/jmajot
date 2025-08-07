

const express = require('express');
const router = express.Router();
const User = require('../model/user');
const { handleSignIn, handleLogout, handleSignUp } = require('../controller/userLogin');


// User Sign Up Route
router.post('/signup', handleSignUp);
// User Sign In Route
router.post('/signin', handleSignIn);   

// User Logout Route
router.get('/logout', handleLogout);

module.exports = router;