const AppError = require('../utils/AppError');
const { ERROR_CODES, ERROR_MESSAGES } = require('../utils/errorCodes');

const notFound = (req, res, next) => {
  next(new AppError(
    `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    404,
    ERROR_CODES.E013,
  ));
};

module.exports = notFound;