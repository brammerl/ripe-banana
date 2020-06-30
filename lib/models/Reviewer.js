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

reviewerSchema.static.reviewCheckAndDelete = async function(reviewerId) {
  const Reviewer = this.model('Reviewer');

  const review = Reviewer.findById(reviewerId);

  if(!review.reviews){
    Reviewer.findByIdAndDelete(review._id);
  } else {
    throw new Error('There are reviews you cannot delete this reviewer');
  }
};
module.exports = mongoose.model('Reviewer', reviewerSchema);
