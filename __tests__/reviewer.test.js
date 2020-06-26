const { MongoMemoryServer } = require('mongodb-memory-server'); 
const mongod = new MongoMemoryServer(); 
const mongoose = require('mongoose'); 
const connect = require('../lib/utils/connect'); 

const request = require('supertest'); 
const app = require('../lib/app'); 
const Reviewer = require('../lib/models/Reviewer'); 


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
  it('gets a reviewer by id via GET', () => {
    return Reviewer.create({
      id: expect.anything(),
      name: 'Breeann B',
      company: 'Alchemy Code Lab'
    })
      .then(reviewers => request(app).get(`/api/v1/reviewers/${reviewers._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Breeann B',
          company: 'Alchemy Code Lab',
          __v: 0,
        });
      });
  });
  
});

