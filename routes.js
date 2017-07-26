const { ObjectID } = require('mongodb');
const router = require('express').Router();
const Job = require('./job/job.model');

router.get('/jobs', (req, res) => {
  const { limit } = req.query;
  Job.find({}).limit(+limit).then(
    jobs =>
      res.status(200).json({
        jobs
      }),
    e => res.status(400).json(e)
  );
});

router.post('/jobs', (req, res) => {
  const newJob = new Job({
    title: req.body.title,
    location: req.body.location
  });
  newJob.save().then(
    job =>
      res.status(200).json({
        job
      }),
    e => res.status(400).json(e)
  );
});

router.get('/jobs/:jobId', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }

  Job.findById(id)
    .then(job => {
      if (!job) {
        return res.status(404).json({ error: 'NOT_FOUND' });
      }
      res.status(200).json({ job });
    })
    .catch(e => {
      res.status(400).json({ error: 'BAD_REQUEST' });
    });
});

module.exports = router;
