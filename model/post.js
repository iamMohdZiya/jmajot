

const mongoose = require('mongoose');


const post = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  // image + text or text only 
  content: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},{
    timestamps: true,
});

module.exports = mongoose.model('Post', post);
