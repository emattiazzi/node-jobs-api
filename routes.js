const router = require('express').Router();
const Job = require('./job/job.controller');
const Company = require('./company/company.controller');

router.get('/jobs', Job.find);

router.post('/jobs', Job.create);

router.get('/jobs/:jobId', Job.findById);
router.patch('/jobs/:jobId', Job.updateById);
router.delete('/jobs/:jobId', Job.deleteById);

router.get('/companies/', Company.find);
router.post('/companies/', Company.create);

module.exports = router;
