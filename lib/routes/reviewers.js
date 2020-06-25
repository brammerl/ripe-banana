const { Router } = require('express');
// const ensureAuth = require('../middleware/ensureAuth');
const Reviewer = require('../models/Reviewer');

module.exports = Router()

// GET /reviewer
// [{
//   _id,
//   name,
//   company
// }]
  .get('/', (req, res, next) => {
    Reviewer
      .find(req.query)
      .select({
        name: true, company: true
      })
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })

// GET /reviewer/:id
// {
//     _id,
//     name,
//     company,
//     reviews: [{
//         _id,
//         rating,
//         review,
//         film: { _id, title }
//     }]
// }
  .get('/:id', (req, res, next) => {
    Reviewer
      .findById(req.params.id)
      .then(reviewer => res.send(reviewer))
      .catch(next);
    //   will need to have film information here eventually
  });

