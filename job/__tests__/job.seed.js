const { ObjectID } = require('mongodb');
const Job = require('../job.model');
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

const populateJobs = (done) => {
  Job.remove({})
    .then(() => {
      return Job.insertMany(jobs);
    })
    .then(() => done());
};

module.exports = {jobs, populateJobs};
