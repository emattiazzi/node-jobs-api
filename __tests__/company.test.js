const expect = require('chai').expect;
const request = require('supertest');

const app = require('../index.js');
const Company = require('../company/company.model');
const {companies, populateCompanies} = require('./seed/seed');

beforeEach(populateCompanies);

describe('GET /companies', () => {
  it('should return a list of companies', done => {
    request(app)
      .get('/companies')
      .expect(200)
      .expect((res) => expect(res.body.companies.length).to.be.equal(3))
      .end(done);
  });
});

describe('GET /companies/me', () => {
  it('should return an company if authenticated', done => {
    request(app)
      .get('/companies/me')
      .set('x-auth', companies[0].tokens[0].token)
      .expect(200)
      .expect((res) => expect(res.body.email).to.be.equal(companies[0].email))
      .end(done);
  });

  it('should return a 401 if not authenticated', done => {
    request(app)
      .get('/companies/me')
      .expect(401)
      .expect(res => expect(res.body.message).to.be.equal('NOT_AUTHORIZED'))
      .end(done);
  });
});

describe('POST /companies', function () {
  it('should create a company' , function (done)  {
    const email = 'enrico@test.com';
    const password = '1234abc';
    request(app)
      .post('/companies')
      .timeout(10000)
      .send({email, password})
      .expect(200)
      .expect(res => {
        expect(res.header['x-auth']).to.exist;
        expect(res.body.company.email).to.be.equal(email);
        expect(res.body.company._id).to.exist;
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        Company.findOne({email}).then(company => {
          expect(company).to.be.exist;
          expect(company.password).to.not.be.equal(password);
          done();
        })
      });
  });

  it('should return an error a param is missing', (done) => {
    request(app)
      .post('/companies')
      .expect(400)
      .end(done);
  });

    it('should return an error if email is used', (done) => {
    request(app)
      .post('/companies')
      .send({
        email: companies[0].email,
        password: 'nothingWillHappen'
      })
      .expect(400)
      .end(done);
  });

});
