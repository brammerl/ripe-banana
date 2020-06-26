const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,  
    required: true
  }
});

reviewerSchema.virtual('reviews', {
  ref: 'Review', 
  localField: '_id', 
  foreignField: 'reviews'
});

module.exports = mongoose.model('Reviewer', reviewerSchema);
