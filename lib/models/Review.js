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
    maxlength: 500 
  },
  film: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Film',
    required: true
  }
});

reviewSchema.statics.topHundred = function() {
  return this.aggregate([
    {
      $sort: {
        'rating': -1
      }
    }
  ]);
};

module.exports = mongoose.model('Review', reviewSchema);
