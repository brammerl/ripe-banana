const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router() 
// creates an actor profile 
  .post('/', (req, res, next) => {
    Actor 
      .create(req.body)
      .then(actor => res.send(actor))
      .catch(next);
  })
  
  //gets all actors 
  .get('/', (req, res, next) => {
    Actor 
      .find(req.query)
      .lean()
      .then(actors => {
        actors.forEach(actor => {
          delete actor.id;
          delete actor.__v;
        });
        res.send(actors);
      })
      .catch(next); 
  })

  //gets actors by id
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

