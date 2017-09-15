const chai = require('chai');
const expect = require('chai').expect;
const sinonChai = require('sinon-chai');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('../../index.js');

const Job = require('../job.model');
const {jobs, populateJobs} = require('./job.seed');
const {companies, populateCompanies} = require('../../company/__tests__/company.seed');

chai.use(sinonChai);

describe('Job', () => {

  beforeEach(populateJobs);
  beforeEach(populateCompanies);
  describe('GET /jobs', () => {
    it('should get all jobs', done => {
      request(app)
        .get('/jobs')
        .expect(200)
        .expect(res => {
          expect(res.body.jobs.length).to.be.equal(3);
        })
        .end(done);
    });

    it('should get paginated jobs and include offset', done => {
      request(app)
        .get('/jobs?offset=1&limit=2')
        .expect(200)
        .expect(res => {
          expect(res.body.jobs.length).to.be.equal(2);
          expect(Number(res.body.offset)).to.be.equal(1);
          expect(Number(res.body.limit)).to.be.equal(2);
          expect(res.body.jobs[0].title).to.be.equal(jobs[1].title);
        })
        .end(done);
    });
  });

  describe('POST /jobs', () => {
    it('should create a new job', done => {
      const newJob = {
        _id: new ObjectID(),
        title: 'Back-end developer',
        location: 'Hammersmith',
        description: 'An horrible company',
        category: 'engineering',
        company: 'Yoox',
        url: 'https://www.yoox.com',
      };
      let jobId;
      request(app)
        .post('/jobs')
        .set('x-auth', companies[0].tokens[0].token)
        .send(newJob)
        .expect(200)
        .expect(res => {
          expect(res.body.job.title).to.be.equal(newJob.title);
          jobId = res.body.job._id;
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Job.findById(jobId)
            .then(job => {
              expect(job).to.exist;
              done();
            })
            .catch(e => done(e));
        });
    });

    it('should not create a new job with invalid data', done => {
      const job = {};
      request(app)
        .post('/jobs')
        .set('x-auth', companies[0].tokens[0].token)
        .send(job)
        .expect(400).end(done);
    });
  });

  describe('GET /jobs/:jobId', () => {
    it('should return given job document', done => {
      const id = jobs[0]._id.toHexString();
      request(app)
        .get(`/jobs/${id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.job.title).to.be.equal(jobs[0].title);
        })
        .end(done);
    });

    it('should return 404 for object not found', done => {
      const id = new ObjectID().toHexString();
      request(app).get(`/jobs/${id}`).expect(404).end(done);
    });

    it('should return 404 for not valid id', done => {
      const id = 123;
      request(app).get(`/jobs/${id}`).expect(404).end(done);
    });
  });

  describe('PATCH /jobs/:jobId', () => {
    it('should update the given document', done => {
      const id = jobs[1]._id.toHexString();
      const body = {
        title: 'Back-end developer'
      };

      request(app)
        .patch(`/jobs/${id}`)
        .set('x-auth', companies[1].tokens[0].token)
        .send(body)
        .expect(200)
        .end((err, res) => {
          expect(res.body.title).to.be.equal(body.title);
          done();
        });
    });

    it('should return 404 if not access', done => {
      const id = jobs[1]._id.toHexString();
      const body = {
        title: 'Back-end developer'
      };

      request(app)
        .patch(`/jobs/${id}`)
        .set('x-auth', companies[0].tokens[0].token)
        .send(body)
        .expect(404)
        .end((err, res) => {
          done();
        });
    });
  });

  describe('DELETE /jobs/:jobId', () => {
    it('should return the deleted document', done => {
      const id = jobs[1]._id.toHexString();
      request(app)
        .delete(`/jobs/${id}`)
        .set('x-auth', companies[1].tokens[0].token)
        .expect(200)
        .expect(res => {
          expect(res.body.job.title).to.be.equal(jobs[1].title);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Job.findById(id).then(job => {
            expect(job).to.not.exist;
            done();
          }).catch(e => done(e));
        });
    });

    it('should not delete if not access', done => {
      const id = jobs[1]._id.toHexString();
      request(app)
        .delete(`/jobs/${id}`)
        .set('x-auth', companies[0].tokens[0].token)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Job.findById(id).then(job => {
            expect(job).to.exist;
            done();
          }).catch(e => done(e));
        });
    });


    it('should return 404 if the document is not found', done => {
      const id = new ObjectID();
      request(app)
        .delete(`/jobs/${id}`)
        .set('x-auth', companies[1].tokens[0].token)
        .expect(404).end(done);
    });

    it('should return 404 if the id is not valid', done => {
      const id = 132;
      request(app)
        .delete(`/jobs/${id}`)
        .set('x-auth', companies[1].tokens[0].token)
        .expect(404)
        .end(done);
    });
  });

});
