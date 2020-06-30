const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
},);

const studioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: [addressSchema]
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

studioSchema.virtual('films', {
  ref: 'Film', 
  localField: '_id', 
  foreignField: 'studio'
});

module.exports = mongoose.model('Studio', studioSchema);
