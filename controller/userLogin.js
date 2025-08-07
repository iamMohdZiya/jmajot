

const User = require('../model/user');

exports.handleSignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie('token', token).redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    // res.render('user/login', { error: 'Incorrect Email or Password' });
  }
};

exports.handleLogout = (req, res) => {
  res.clearCookie('token').redirect('/');
};

exports.handleSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.send('Account created successfully! Please log in.');
  } catch (error) {
    console.error('Signup error:', error);
    // res.render('user/signup', { error: 'Error creating account' });
  }
};