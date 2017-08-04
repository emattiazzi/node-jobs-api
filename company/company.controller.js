const Company = require('./company.model');
const { pick } = require('lodash');

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

const login = (req, res) => {
  const body = pick(req.body, ['email', 'password']);
  Company.findByCredentials(body.email, body.password)
    .then((company) => {
      return company.generateAuthToken(company.token).then((token) => {
        res.header('x-auth', token).status(200).json({ company });
      });
    })
    .catch((e) => {
      res.status(401).send({ message: 'WRONG_CREDENTIALS' });
    });
};

module.exports = {
  create,
  find,
  findByToken,
  login
};
