const {Schema} = require('mongoose');

const jobSchema = new Schema({
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

module.exports = Job;
