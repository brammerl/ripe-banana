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
      // .then(film => {
      //   film.studios.forEach(studio => { 
      //     delete studio.cast;
      //     delete studio._id;
      //   });
      //   res.send(film);
      // })
      .catch(next);
  });
