const router = require('express').Router();
const Job = require('./job/job.model');

router.get('/jobs', (req, res) => {
  const {limit} = req.query;
  Job.find({})
        .limit(+limit)
        .then(jobs => res.status(200).json({
          jobs
        }), e => res.status(400).json(e));
});

router.post('/jobs', (req, res) => {
  const newJob = new Job({
    title: req.body.title,
    location: req.body.location
  });
  newJob.save()
    .then(job => res.status(200).json({
      job
    }), e => res.status(400).json(e));
});


module.exports = router;
