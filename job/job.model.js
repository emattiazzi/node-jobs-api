const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  url: String
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
