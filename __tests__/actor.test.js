const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');


describe('actor routes', () => {
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

  it('creates an actor profile via POST', () => {
    return request(app)
      .post('/api/v1/actors/')
      .send({
        name: 'actor name',
        dob: Date(),
        pob: 'Oakland, CA'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'actor name',
          dob: expect.anything(),
          pob: 'Oakland, CA'
        });
      });
  });

  it('gets all actors via GET', async() => {
    await Actor.create([{
      name: 'actor name',
      dob: Date(),
      pob: 'Oakland, CA'
    }, {
      name: 'actor name 2',
      dob: Date(),
      pob: 'Portland, OR '
    }]);

    return request(app)
      .get('/api/v1/actors/')
      .then(res => {
        expect(res.body).toEqual([
          {
            _id: expect.anything(),
            name: 'actor name',
            dob: expect.anything(),
            pob: 'Oakland, CA',
          }, {
            _id: expect.anything(),
            name: 'actor name 2',
            dob: expect.anything(),
            pob: 'Portland, OR ',
          }
        ]);
      });
  });
  
  it.only('gets actors by id via GET', async() => {
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
      title: 'Film Title',
      studio: studio._id,
      released: 2020,
      cast: [{
        role: 'Lead',
        actor: actor._id
      }]
    });

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.anything(),
          name: 'actor name',
          dob: expect.anything(),
          pob: 'Oakland, CA',
          films: [{
            title: film.title,
            released: film.released
          }]
        });
      });
  });
});
