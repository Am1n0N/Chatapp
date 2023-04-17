const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  interests: [{
    type: String,
    required: true,
  }],
  preferences: {
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    ageRange: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    interests: [{
      type: String,
      required: true,
    }],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;