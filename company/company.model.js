const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

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
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

companySchema.plugin(uniqueValidator);

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
