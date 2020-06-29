const { Router } = require('express');
// const ensureAuth = require('../middleware/ensureAuth');
const Film = require('../models/Film');

module.exports = Router()

// creates an film
  .post('/', (req, res, next) => {
    Film 
      .create(req.body)
      .then(film => res.send(film))
      .catch(next);
  })

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
        path: 'cast.actor', 
        select: { name: true }
      })
      .populate({ 
        path: 'reviews',
        select: {
          rating: true, 
          reviewer: true, 
          review: true
        }, 
        populate: { 
          path: 'reviewer', 
          select: {
            name: true, 
            _id: true
          }
        }
      })
      .lean()
      .then(film => {
        film.reviews.forEach(review => {
          delete review.film;
        });
        res.send(film);
      })
      .catch(next);
  });

