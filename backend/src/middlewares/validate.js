const { validationResult } = require('express-validator');

/**
 * Middleware que lee el resultado de express-validator.
 * Si hay errores los agrupa y responde 422.
 * Si no hay errores, pasa al siguiente middleware.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field:   err.path,
      message: err.msg,
    }));

    return res.status(422).json({
      status:  'error',
      message: 'Error de validación',
      errors:  formatted,
    });
  }
  next();
};

module.exports = validate;