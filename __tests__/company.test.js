const expect = require('chai').expect;
const request = require('supertest');

const app = require('../index.js');
const Company = require('../company/company.model');


beforeEach(done => {
  const myFakeCompanies = [{
    email: 'mickey@disney.com',
    password: 'quiquoqua'
  },{
    email: 'silente@hogwarts.com',
    password: 'leviosa'
  }, {
    email: 'willy@acme.com',
    password: 'beepbeep'
  }];

  Company
    .remove({})
    .then(() => Company.insertMany(myFakeCompanies))
    .then(() => done());
});

describe('GET /companies', () => {
  it('should return a list of companies', done => {
    request(app)
      .get('/companies')
      .expect(200)
      .expect((res) => expect(res.body.companies.length).to.be.equal(3))
      .end(done);
  });
});

describe('POST /companies', () => {
  it('should create a new company' , (done) => {
    const email = 'enrico@test.com';
    const password = '1234abc';

    request(app)
      .post('/companies')
      .send({email, password})
      .expect(200)
      .expect(res => {
        expect(res.header['x-auth']).to.exist;
        expect(res.body.company.email).to.be.equal(email);
        expect(res.body.company._id).to.exist;
      }, e => console.log(e))
      .end(done);
  });

  it('should return an error if email is a mandatory param is missing', (done) => {
    request(app)
      .post('/companies')
      .expect(400)
      .end(done);
  });
});
