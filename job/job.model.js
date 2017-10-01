const mongoose = require('mongoose');
const validator = require('validator');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  description: {
    type: String
  },
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
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

jobSchema.statics = {
  createSafeFields: [
    'title',
    'location',
    'description',
    'category',
    'company',
    'email',
    'url']
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
