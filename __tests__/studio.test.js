const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose'); 
const connect = require('../lib/utils/connect'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
const Studio = require('../lib/models/Studio'); 
const Film = require('../lib/models/Film'); 


describe('studio routes', () => {

  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
      
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio; 
  let film;
  
  beforeEach(async() => {
    studio = await Studio.create({
      name: 'Portland Studio',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'US'
      }
    });
  });
  
  beforeEach(async() => {
    film = await Film.create({
      title: 'My Own Private Idaho',
      studio: studio.id, 
      released: 1991, 
      cast: [{
        role: 'Scott Favor',
        actor: 'Keanu Reeves'
      }]
    });
  });
  
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });
  
  // GET /studios
  // [{ _id, name }]
  it('gets all studios via GET', () => {
    return request(app).get('/api/v1/studios')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(), 
          name: 'Portland Studio'
        }]);
      });
  }); 

  it('gets a studio by id via GET', () => {
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Portland Studio',
          address: [{
            _id: expect.anything(),
            city: 'Portland',
            state: 'Oregon',
            country: 'US'
          }],
          films: [{
            _id: expect.anything(),
            title: film.title,
            studio: studio.id
          }],
        });
      });
  });

  it('creates a new studio via POST', () => {
    return request(app)
      .post('/api/v1/studios/')
      .send({
        name: 'studio name',
        address: [{
          city: 'Portland',
          state: 'OR',
          country: 'USA'
        }]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'studio name',
          address: [{
            _id: expect.anything(),
            city: 'Portland',
            state: 'OR',
            country: 'USA'
          }]
        });
      });
  });
});


