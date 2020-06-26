const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router() 
  .post('/', (req, res, next) => {
    Actor 
      .create(req.body)
      .then(actor => res.send(actor))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Actor 
      .find(req.query)
      .then(actors => res.send(actors))
      .catch(next); 
  })
  
  .get('/:id', (req, res, next) => {
    Actor
      .findById(req.params.id)
      .populate('films', { title: true, released: true })
      .lean()
      .then(actor => {
        actor.films.forEach(film => { 
          delete film.cast;
          delete film._id;
        });
        res.send(actor);
      })
      .catch(next);
  });

