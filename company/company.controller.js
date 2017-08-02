const Company = require('./company.model');

const create = (req, res) => {
  const { email, password } = req.body;
  const newCompany = new Company({
    email,
    password
  });

  newCompany.save()
    .then(company => res.status(200).json({ company }))
    .catch((e) => {
      res.status(400).send({ message: 'BAD_REQUEST', errors: e.errors });
    });
};

const find = (req, res) => {
  Company.find()
    .then(companies => res.status(200).json({companies}))
    .catch(() => res.status(400).json({message: 'BAD_REQUEST'}));
};

module.exports = {
  create,
  find
};
