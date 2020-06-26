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
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id,
      delete ret.__v;
    }
  },
  toObject: {
    virtuals: true }
});

reviewerSchema.virtual('reviews', {
  ref: 'Review', 
  localField: '_id', 
  foreignField: 'reviewer'
});

module.exports = mongoose.model('Reviewer', reviewerSchema);
