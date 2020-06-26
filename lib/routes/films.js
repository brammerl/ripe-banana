const { Router } = require('express');
// const ensureAuth = require('../middleware/ensureAuth');
const Film = require('../models/Film');

module.exports = Router()

  .get('/', (req, res, next) => {
    Film
      .findbyId(req.query)
      .select({
        title: true, 
        released: true, 
        studio: true
      })
      .populate('studios', { name: true })
      .then(films => res.send(films))
      .catch(next);
  });
