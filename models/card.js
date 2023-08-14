const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  likes: {
    type: mongoose.Schema.Types.Array,
    default: [],
    required: true
  },
  createdAt: {
    type: Date,
    enum: [Date.now],
    required: true
  },
});

module.exports = mongoose.model('user', userSchema);