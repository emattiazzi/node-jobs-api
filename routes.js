const router = require('express').Router();
const Job = require('./job/job.controller');
const Company = require('./company/company.controller');
const CompanyMiddleware = require('./company/company.middleware');

router.get('/jobs', Job.find);

router.post('/jobs', Job.create);

router.get('/jobs/:jobId', Job.findById);
router.patch('/jobs/:jobId', Job.updateById);
router.delete('/jobs/:jobId', Job.deleteById);

router.get('/companies/', Company.find);
router.get('/companies/me', CompanyMiddleware.authenticate, Company.findByToken);
router.post('/companies/', Company.create);
router.post('/companies/login', Company.login);
router.delete('/companies/logout', CompanyMiddleware.authenticate, Company.logout);

module.exports = router;
