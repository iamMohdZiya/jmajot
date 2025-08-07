const mongoose = require('mongoose');
const User = require('../model/user');
const educationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  batchYear: {
    type: String,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  currentCollege: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  percentage_10th: {
    type: Number,
    college:{
        type: String,
        required: false
    },
    startDate: {
      type: Date,
      required: false
    },
    required: false
  },
  percentage_12th: {
    type: Number,
    college: {
      type: String,
      required: false
    },
    startDate: {
      type: Date,
      required: false
    },
    required: false
  },
  graduationPercentage: {
    type: Number,
    required: false
  },

}, {
  timestamps: true
});

const Education = mongoose.model('Education', educationSchema);


module.exports = Education;
