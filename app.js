const express = require('express');
const app = express();
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const { checkForAthenticationCookie } = require('./middleware/auth');
const userRoutes = require('./routes/user');
require('dotenv').config();

db();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(checkForAthenticationCookie('token'));
app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
}
);


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
});

