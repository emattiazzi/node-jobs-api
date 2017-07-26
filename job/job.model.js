const mongoose = require('mongoose');

const Job = mongoose.model('Job', {
  title: String
});

module.exports = Job;
