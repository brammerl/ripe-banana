const { Router } = require('express');
// const ensureAuth = require('../middleware/ensureAuth');
const Film = require('../models/Film');

module.exports = Router()

  .get('/', (req, res, next) => {
    Film
      .find(req.query)
      .populate('studio', { name: true })
      .lean()
      .select({
        title: true, 
        released: true, 
        studio: true, 
        cast: true
      })
      .then(films => res.send(films))
      .catch(next);
  })

  //gets films by id
  .get('/:id', (req, res, next) => {
    Film
      .findById(req.params.id)
      .populate('studio', { name: true })
      .populate({
        path: 'actor', 
        select: {
          _id: true, 
          role: true,
          actor: true
        }
      })

      .then(film => res.send(film))
      .catch(next);
  });
