const router = require('express').Router();
const Job = require('./job/job.controller');

router.get('/jobs', Job.find);

router.post('/jobs', Job.create);

router.get('/jobs/:jobId', Job.findById);

router.delete('/jobs/:jobId', Job.deleteById);

module.exports = router;
