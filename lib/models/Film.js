const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
  role: {
    type: String
  },
  actor: {
    type: String,
    required: true
  },
});

const filmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  }, 
  studio: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true
  },
  cast: [castSchema]
});

module.exports = mongoose.model('Film', filmSchema);
