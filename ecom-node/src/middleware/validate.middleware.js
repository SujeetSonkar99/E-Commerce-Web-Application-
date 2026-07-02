const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = {};
    errors.array().forEach(e => { formatted[e.path] = e.msg; });
    return res.status(400).json(formatted);
  }
  next();
};

module.exports = validate;
