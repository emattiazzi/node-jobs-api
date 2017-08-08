const jwt = require('jsonwebtoken');
const Company = require('../../company/company.model');
const { ObjectID } = require('mongodb');

const companyOneId = new ObjectID();
const companyTwoId = new ObjectID();

const companies = [
  {
    _id: companyOneId,
    email: 'companyOne@test.com',
    password: 'companyOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: companyOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: companyTwoId,
    email: 'companyTwo@test.com',
    password: 'companyTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: companyTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: new ObjectID(),
    email: 'companyThree@test.com',
    password: 'companyThreePass'
  }
];

const populateCompanies = function (done) {
  this.timeout(10000);
  Company.remove({})
    .then(() => {
      var companyOne = new Company(companies[0]).save();
      var companyTwo = new Company(companies[1]).save();
      var companyThree = new Company(companies[2]).save();

      return Promise.all([companyOne, companyTwo, companyThree]);
    })
    .then(() => done());
};


module.exports = {companies, populateCompanies };
