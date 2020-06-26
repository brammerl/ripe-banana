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

describe('reviewer routes', () => {

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
  

  it('gets all reviewers via GET', () => {
    return Reviewer.create({
      id: expect.anything(),
      name: 'Breeann B',
      company: 'Alchemy Code Lab'
    //   __v: 0
    })
      .then(() => request(app).get('/api/v1/reviewers'))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          name: 'Breeann B',
          company: 'Alchemy Code Lab'
        }]);
      });
  }); 

  //will need to add reviews information
  it('gets a reviewer by id via GET', async() => {
    const reviewer = await Reviewer.create({
      name: 'Breeann B',
      company: 'Alchemy Code Lab'
    });

    const studio = await Studio.create({
      name: 'Portland Studio'
    });
    
    const film = await Film.create({
      title: 'film title',
      studio: studio._id,
      released: 2020
    });

    await Review.create({
      rating: 5,
      reviewer: reviewer._id,
      review: 'this movie was sooo good',
      film: film._id
    });
    
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Breeann B',
          company: 'Alchemy Code Lab',
          reviews: {
            _id: expect.anything(),
            rating: 5,
            review: 'this movie was sooo good',
            fim: {
              _id: expect.anything(),
              title: 'film title'
            }
          },
          __v: 0,
        });
      });
  });
  
  // it('creates a reviewer via POST', async()  => {
  //   const reviewer = await Reviewer.create({
  //     name: 'Breeann B',
  //     company: 'Alchemy Code Lab'
  //   });

  //   const studio = await Studio.create({
  //     name: 'Portland Studio'
  //   });

  //   const film = await Film.create({
  //     title: 'film title',
  //     studio: studio._id,
  //     released: 2020
  //   });

  //   return request(app)
  //     .post('/api/v1/reviewers/')
  //     .send({
  //       rating: 5,
  //       reviewer: reviewer._id,
  //       review: 'this movie was sooo good',
  //       film: film._id
  //     })
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         _id: expect.anything(),
  //         rating: 5,
  //         reviewer: reviewer._id,
  //         review: 'this movie was sooo good',
  //         film: film._id
  //       });
  //     });
  // });
});

