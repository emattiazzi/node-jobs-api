const jwt = require('jsonwebtoken');
const Company = require('../../company/company.model');
const { ObjectID } = require('mongodb');

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
