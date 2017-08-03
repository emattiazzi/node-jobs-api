const Company = require('./company.model');

const create = (req, res) => {
  const { email, password } = req.body;
  const company = new Company({
    email,
    password
  });

  company
    .save()
    .then(() => company.generateAuthToken())
    .then(token => {
      res.header('x-auth', token).status(200).json({ company });
    })
    .catch(e => {
      res.status(400).send({
        message: 'BAD_REQUEST',
        errors: e
      });
    });
};

const find = (req, res) => {
  Company.find()
    .then(companies => res.status(200).json({ companies }))
    .catch(() => res.status(400).json({ message: 'BAD_REQUEST' }));
};

const findByToken = (req, res) => {
  res.json(req.company);
};

module.exports = {
  create,
  find,
  findByToken
};
