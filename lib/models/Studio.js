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
});

const studioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: [addressSchema]
});

studioSchema.virtual('films', {
  ref: 'Film', 
  localField: '_id', 
  foreignField: 'studio'
});

module.exports = mongoose.model('Studio', studioSchema);
