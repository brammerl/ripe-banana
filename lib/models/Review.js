const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true, 
    minimum: 1, 
    maximum: 5
  }, 
  reviewer: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Reviewer',
    required: true
  },
  review: {
    type: String,
    required: true, 
    maxlength: 140 
  },
  film: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Film',
    required: true
  }
});

module.exports = mongoose.model('Review', reviewSchema);
