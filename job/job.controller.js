const {pick} = require('lodash');
const { ObjectID } = require('mongodb');
const Job = require('./job.model');

const find = (req, res) => {
  const { offset, limit } = req.query;
  if (offset < 0 || limit < 0) {
    res.status(400).json({ error: 'BAD_REQUEST' });
  }
  Job.find({}).limit(Number(limit)).skip(Number(offset)).then(
    jobs =>
      res.status(200).json({
        jobs,
        offset,
        limit
      }),
    e => res.status(400).json(e)
  );
};

const findByCompanyToken = (req,res) => {
  const { offset, limit } = req.query;
  const _creator = req.company._id;
  if (offset < 0 || limit < 0) {
    res.status(400).json({ error: 'BAD_REQUEST' });
  }
  Job.find({_creator}).limit(Number(limit)).skip(Number(offset)).then(
    jobs =>
      res.status(200).json({
        jobs,
        offset,
        limit
      }),
    e => res.status(400).json(e)
  );
};

const findById = (req, res) => {
  const id = req.params.jobId;

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
    .catch(() => {
      res.status(400).json({ error: 'BAD_REQUEST' });
    });
};

const create = (req, res) => {
  const newJob = new Job(pick(req.body, Job.createSafeFields));
  newJob._creator = req.company._id;
  newJob.save().then(
    job =>
      res.status(200).json({
        job
      }),
    () => {
      res.status(400).json({ error: 'BAD_REQUEST' });
    });
};

const deleteById = (req, res) => {
  const id = req.params.jobId;

  if (!ObjectID.isValid(id)) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }

  Job.findOneAndRemove({
    _id: id,
    _creator: req.company._id
  })
    .then(job => {
      if (!job) {
        return res.status(404).json({ error: 'NOT_FOUND' });
      }
      res.status(200).json({ job });
    })
    .catch(() => {
      res.status(400).json({ error: 'BAD_REQUEST' });
    });
};

const updateById = (req, res) => {
  const id = req.params.jobId;
  const body =  pick(req.body, Job.createSafeFields);

  if (!ObjectID.isValid(id)) {
    return res.status(404).json({ error: 'NOT_VALID' });
  }

  Job.findOneAndUpdate({
    _id: id,
    _creator: req.company._id
  }, {$set: body}, {new: true})
    .then(job => {
      if (!job) {
        return res.status(404).json({ error: 'NOT_FOUND' });
      }

      res.status(200).json(job);
    })
    .catch(() => res.status(400).json({ error: 'BAD_REQUEST' }));
};

module.exports = {
  create,
  deleteById,
  find,
  findById,
  findByCompanyToken,
  updateById
};
