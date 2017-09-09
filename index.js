const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('./config/db.config');
const env = require('./config/env.config.js')
const app = express();

// Environment settings
const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT

// Middlewares
app.use(cors({
  exposedHeaders: ['x-auth']
}));
app.use(bodyParser.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use(require('./routes'));

// Start the server
app.listen(PORT, () => {
  mongoose.connect(MONGODB_URI, {
    useMongoClient: true
  }).catch(() => {
    process.exit(1);
  });
});

module.exports = app;