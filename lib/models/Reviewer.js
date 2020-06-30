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

reviewerSchema.statics.reviewCheckAndDelete = async function(reviewerId) {
  const Reviewer = this.model('Reviewer');

  const review = await Reviewer.findById(reviewerId)
    .populate('reviews');
  console.log(review.reviews);

  if(review.reviews.length === 0){
    return Reviewer.findByIdAndDelete(review._id);
  } else {
    throw new Error('There are reviews you cannot delete this reviewer');
  }
};

module.exports = mongoose.model('Reviewer', reviewerSchema);
