const router = require('express').Router();
const Job = require('./job/job.controller');
const Company = require('./company/company.controller');
const CompanyMiddleware = require('./company/company.middleware');

router.get('/jobs', Job.find);
router.post('/jobs', CompanyMiddleware.authenticate, Job.create);

router.get('/jobs/:jobId', Job.findById);
router.patch('/jobs/:jobId', CompanyMiddleware.authenticate, Job.updateById); // Auth
router.delete('/jobs/:jobId', CompanyMiddleware.authenticate, Job.deleteById); // Auth

router.get('/companies/', Company.find);
router.post('/companies/', Company.create);
// Add patch and delete

router.post('/login', Company.login);
router.delete('/logout', CompanyMiddleware.authenticate, Company.logout);

router.get('/me', CompanyMiddleware.authenticate, Company.findByToken);
router.get('/me/jobs', CompanyMiddleware.authenticate, Job.findByCompanyToken);

module.exports = router;
