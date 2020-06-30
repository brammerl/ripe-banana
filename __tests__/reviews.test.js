const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose'); 
const connect = require('../lib/utils/connect'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
const Reviewer = require('../lib/models/Reviewer'); 
const Review = require('../lib/models/Review');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const chance = require('chance').Chance();

describe('review routes', () => {

  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
  let reviewer;
  let film; 
  let studio;
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  
 

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a review via POST', async() => {
    reviewer = await Reviewer.create({
      name: 'Breeann B',
      company: 'Alchemy Code Lab'
    });

    studio = await Studio.create({
      name: 'Portland Studio'
    });

    film = await Film.create({
      title: 'film title',
      studio: studio._id,
      released: 2020
    });

    return request(app)
      .post('/api/v1/reviews/')
      .send({
        rating: 5,
        reviewer: reviewer._id,
        review: 'good film',
        film: film._id   
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          rating: 5,
          reviewer: reviewer.id,
          review: 'good film',
          film: film.id,
          __v: 0
        });
      });
  });

  it('gets top 100 reviews via GET', async() => {
    reviewer = await Reviewer.create({
      name: 'Breeann B',
      company: 'Alchemy Code Lab'
    });

    studio = await Studio.create({
      name: 'Portland Studio'
    });

    film = await Film.create({
      title: 'film title',
      studio: studio._id,
      released: 2020
    });

    await Promise.all([... Array(150)].map(() => {
      return Review.create({
        rating: chance.pickone([1, 2, 3, 4, 5]),
        reviewer: reviewer._id,
        review: chance.paragraph({ sentences: 2 }),
        film: film._id
      });
    })
    );
    return request(app)
      .get('/api/v1/reviews/')
      .then(res => {
        expect(res.body).toHaveLength(100);
      });
  });

  it('deletes review by ID via DELETE', async() => {
    reviewer = await Reviewer.create({
      name: 'Breeann B',
      company: 'Alchemy Code Lab'
    });

    studio = await Studio.create({
      name: 'Portland Studio'
    });

    film = await Film.create({
      title: 'film title',
      studio: studio._id,
      released: 2020
    });
    
    const review = await Review.create({
      rating: chance.pickone([1, 2, 3, 4, 5]),
      reviewer: reviewer._id,
      review: chance.paragraph({ sentences: 2 }),
      film: film._id
    });

    return request(app)
      .delete(`/api/v1/reviews/${review._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          rating: review.rating,
          reviewer: reviewer.id,
          review: review.review,
          film: film.id,
          __v: 0,
        });
      });
  });
});
