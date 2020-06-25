const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Actor = require('../lib/models/Actor');

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
          pob: 'Oakland, CA',
          __v: 0
        });
      });
  });

  it('gets all actors via GET', async() => {
    await Actor.create({
      name: 'actor name',
      dob: Date(),
      pob: 'Oakland, CA'
    });
  });
});
