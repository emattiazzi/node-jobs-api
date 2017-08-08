const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  description: {
    type: String
  },
  category: {
    type: String
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  published: {
    type: Boolean,
    default: false
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
