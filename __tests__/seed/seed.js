const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken')
const Company = require('../../company/company.model');
const Job = require('../../job/job.model');

const companyOneId = new ObjectID();
const companies = [
  {
    _id: companyOneId,
    email: 'companyOne@test.com',
    password: 'companyOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: companyOneId, access: 'auth'}, 'MY_SECRET_VALUE').toString()
    }]
  },
  {
    _id: new ObjectID(),
    email: 'companyTwo@test.com',
    password: 'companyTwoPass'
  },
  {
    _id: new ObjectID(),
    email: 'companyThree@test.com',
    password: 'companyThreePass'
  }
];

const jobs = [
  {
    _id: new ObjectID(),
    title: 'Front-end developer',
    location: 'Shoreditch',
    description: 'An amazing company',
    category: 'engineering',
    company: 'busuu',
    email: 'dan@busuu.com',
    url: 'https://www.busuu.com'
  },
  {
    _id: new ObjectID(),
    title: 'Account Manager',
    location: 'City',
    description: 'An horrible company',
    category: 'operations',
    company: 'Zoopla',
    email: 'hello@zoopla.com',
    url: 'https://www.zoopla.com'
  },
  {
    _id: new ObjectID(),
    title: 'Product Manager',
    location: 'Holborn',
    description: 'An horrible company',
    category: 'management',
    company: 'Google',
    email: 'hello@google.com',
    url: 'https://www.google.com'
  }
];


const populateCompanies = function (done) {
  this.timeout(10000);
  Company.remove({})
    .then(() => {
      var companyOne = new Company(companies[0]).save();
      var companyTwo = new Company(companies[1]).save();
      var companyThree = new Company(companies[2]).save();

      return Promise.all([companyOne, companyTwo, companyThree])
    })
    .then(() => done());
};

const populateJobs = (done) => {
  Job.remove({})
    .then(() => {
      return Job.insertMany(jobs);
    })
    .then(() => done());
};
module.exports = { companies, populateCompanies, jobs, populateJobs };
