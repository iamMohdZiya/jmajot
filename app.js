const express = require('express');
const app = express();
const path = require('path');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const { checkForAthenticationCookie } = require('./middleware/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
require('dotenv').config();

db();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAthenticationCookie('token'));

// Serve static files from uploads directory
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));
app.use('/uploads/posts', express.static(path.join(__dirname, 'uploads/posts')));

// Routes
app.use('/user', userRoutes);
app.use('/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
});

