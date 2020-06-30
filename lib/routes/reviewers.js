const { Router } = require('express');
// const ensureAuth = require('../middleware/ensureAuth');
const Reviewer = require('../models/Reviewer');

module.exports = Router()
  .get('/', (req, res, next) => {
    Reviewer
      .find(req.query)
      .select({
        name: true, company: true
      })
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })


  .get('/:id', (req, res, next) => {
    Reviewer
      .findById(req.params.id)
      .populate({ 
        path: 'reviews',
        select: {
          _id: true, 
          film: true,
          rating: true,
          review: true, 
        },
        populate: {
          path: 'film',
          select: {
            title: true,
            _id: true 
          }
        }
      })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })

  .post('/', (req, res, next) => {
    Reviewer 
      .create(req.body)
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Reviewer 
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(review => res.send(review))
      .catch(next);
  })

  // Reviewers cannot be deleted if there are reviews
  .delete('/:id', (req, res, next) => {
    Reviewer
      .findByIdAndDelete(req.params.id)
      .then(reviewer => res.send(reviewer))
      .catch(next);
  });
  

