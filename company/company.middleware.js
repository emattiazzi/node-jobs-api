const Company = require('./company.model');

const authenticateCompany = (req, res, next) => {
  const token = req.headers['x-auth'];
  Company.findByToken(token).then(company => {
    if (!company) {
      return Promise.reject();
    }

    req.company = company;
    req.token = token;
    next();
  }).catch(() => {
    res.status(401).json({message: 'NOT_AUTHORIZED'});
  });
};

module.exports = {
  authenticate: authenticateCompany
};
