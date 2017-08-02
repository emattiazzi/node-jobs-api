const mongoose = require('mongoose');
const validator = require('validator');
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
      message: '{VALUE} is not a valid email'
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

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
