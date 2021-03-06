const { Router } = require('express');
// const ensureAuth = require('../middleware/ensureAuth');
const Studio = require('../models/Studio');

module.exports = Router()

// GET /studios
// [{ _id, name }]
  .get('/', (req, res, next) => {
    Studio
      .find(req.query)
      .select({
        name: true
      })
      .then(studios => res.send(studios))
      .catch(next);
  })

// GET /studios/:id
// { _id, name, address, films: [{ _id, title, studio }] }
  .get('/:id', (req, res, next) => {
    Studio
      .findById(req.params.id)
      .populate('studio', { name: true, address: true })
      .then(studio => res.send(studio))
      .catch(next);
    //   will need to have film information here eventually
  });

