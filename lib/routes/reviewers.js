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
  });

