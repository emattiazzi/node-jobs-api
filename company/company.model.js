const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const {pick} = require('lodash');
const { ObjectID } = require('mongodb');

const companySchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'EMAIL_REQUIRED'],
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      isAsync: false,
      message: 'EMAIL_NOT_VALID'
    }
  },
  password: {
    type: String,
    required: [true, 'PASSWORD_REQUIRED'],
    minlength: [6, 'PASSWORD_MIN_LENGTH']
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

companySchema.plugin(uniqueValidator);

companySchema.methods.toJSON = function () {
  let company = this;
  let companyObject = company.toObject();

  return pick(companyObject, '_id', 'email');
};

companySchema.methods.generateAuthToken = function() {
  let company = this;
  const access = 'auth';
  const token = jwt
    .sign({ _id: company._id.toHexString(), access }, 'MY_SECRET_VALUE')
    .toString();
  company.tokens.push({ access, token });
  return company.save().then(() => token);
};

companySchema.statics.findByToken = function (token) {
  const Company = this;
  let decoded;
  
  try {
    decoded = jwt.verify(token, 'MY_SECRET_VALUE')
  } catch (e) {
    return Promise.reject();
  }

  return Company.findOne({
    '_id': new ObjectID(decoded._id),
    'tokens.access': 'auth',
    'tokens.token': token
  })
  
}
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
