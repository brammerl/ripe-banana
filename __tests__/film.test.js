const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose'); 
const connect = require('../lib/utils/connect'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
const Studio = require('../lib/models/Studio'); 
const Film = require('../lib/models/Film'); 
const Actor = require('../lib/models/Actor');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer'); 


describe('film routes', () => {

  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
      
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });
  
  //   GET /films
  //   [{
  //       _id, title, released,
  //       studio: { _id, name }
  //   }]

  it('gets all studios via GET', async() => {
    const actor = await Actor.create({
      name: 'actor name',
      dob: Date(),
      pob: 'Oakland, CA'
    });

    const studio = await Studio.create({
      name: 'Portland Studio',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'US'
      }
    }); 

    await Film.create({
      title: 'My Own Private Idaho',
      studio: {
        _id: studio.id,
        name: studio.name,
      },
      released: 1991, 
      cast: [{
        role: 'Scott Favor',
        actor: actor._id
      }]
    });
    
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(), 
          title: 'My Own Private Idaho',
          released: 1991, 
          cast: [{
            _id: expect.anything(),
            role: 'Scott Favor',
            actor: actor.id
          }],
          studio: {
            _id: studio.id,
            name: studio.name,
          }
        }
        ]);
      });
  }); 



  it.only('gets films by id via GET', async() => {
    const actor = await Actor.create({
      name: 'actor name',
      dob: Date(),
      pob: 'Oakland, CA'
    });

    const studio = await Studio.create({
      name: 'Portland Studio',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'US'
      }
    }); 

    const film = await Film.create({
      title: 'My Own Private Idaho',
      studio: {
        _id: studio.id,
        name: studio.name,
      },
      released: 1991, 
      cast: [{
        role: 'Scott Favor',
        actor: actor._id
      }]
    });

    const reviewer = await Reviewer.create({ 
      name: 'Breeann B',
      company: 'Alchemy'
    }); 

    const review = await Review.create({
      rating: 1, 
      reviewer: {
        name: reviewer.name
      }, 
      review: 'The worst movie everrrr', 
      film: [{
        title: 'My Own Private Idaho'
      }]
    }); 

    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({
          title: 'My Own Private Idaho',
          studio: {
            _id: studio.id,
            name: studio.name,
          },
          released: 1991, 
          cast: [{
            role: 'Scott Favor',
            actor: actor._id
          }],
          reviews: [{
            _id: expect.anything(), 
            rating: review.rating, 
            reviewer: [{
              name: reviewer.name
            }], 
            review: review.review
          }],
          __v: 0,
        });
      });
  }); 


});
