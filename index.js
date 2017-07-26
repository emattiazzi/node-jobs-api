const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const mongoose = require('./config/db.config');

const app = express();

// Environment settings
const HOSTNAME = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());

if (process.env.ENVIRONMENT !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use(require('./routes'));

app.listen(PORT, () => {
  mongoose.connect(`mongodb://${HOSTNAME}:27017/LondonJobs`, {
    useMongoClient: true
  });
});

module.exports = app;
