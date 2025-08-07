const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: false,
    default: 'default-profile.png'
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },
  bio: {
    type: String,
    required: false,
    default: 'me'
  },
  salt: {
      type: String
    },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
},
  {
    timestamps: true,  
  }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  const salt = randomBytes(16).toString('hex');
  this.salt = salt;
  this.password = createHmac('sha256', salt)
    .update(this.password)
    .digest('hex');
  next(); 
});

userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User Not Found!');

    const userProvidedHash = createHmac('sha256', user.salt)
      .update(password)
      .digest('hex');

    if (user.password !== userProvidedHash) throw new Error('Incorrect Password!');

    const { createTokenForUser } = require('../service/authentication');
    return createTokenForUser(user);
  } catch (error) {
    console.error('Error in matchPasswordAndGenerateToken:', error.message);
    throw error; // Re-throw the error after logging it
  }
};

module.exports = mongoose.model('User', userSchema);
