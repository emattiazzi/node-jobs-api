const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../index.js');
const Company = require('../company.model');
const {companies, populateCompanies} = require('./company.seed');

describe('Company', () => {
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
            expect(company).to.exist;
            expect(company.password).to.not.be.equal(password);
            done();
          });
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

  describe('POST /companies/login', () => {
    it('should authenticate the company', done => {
      const credentials = {
        email: companies[1].email,
        password: companies[1].password
      };
      request(app)
        .post('/companies/login')
        .send(credentials)
        .expect(200)
        .expect(res => {
          expect(res.header['x-auth']).to.exist;
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }


          Company.findById(companies[1]._id)
            .then(company => {
              expect(company.tokens[0]).to.include({
                access: 'auth',
                token: res.header['x-auth']
              });
              done();
            }).catch(e => done(e));

        });
    });

    it('should return 401 if the password is wrong', done => {
      const credentials = {
        email: companies[1].email,
        password: companies[1].password + 'A'
      };
      request(app)
        .post('/companies/login')
        .send(credentials)
        .expect(401)
        .expect(res => {
          expect(res.header['x-auth']).to.not.exist;
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Company.findById(companies[1]._id).then((company) => {
            expect(company.tokens.length).to.be.equal(0);
            done();
          }).catch(e => done(e))
        });
    });

    it('should return 401 if the email is wrong', done => {
      const credentials = {
        email: companies[1].email + 'A',
        password: companies[1].password
      };
      request(app)
        .post('/companies/login')
        .send(credentials)
        .expect(401)
        .end(done);
    });

    it('should return 401 if the email and password doesn\'t exist', done => {
      const credentials = {
        email: companies[1].email + 'A',
        password: companies[1].password + 'A'
      };
      request(app)
        .post('/companies/login')
        .send(credentials)
        .expect(401)
        .end(done);
    });
  });
});
