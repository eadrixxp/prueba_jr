const { ERROR_CODES } = require('../utils/errorCodes');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Error operacional conocido (AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status:    'error',
      errorCode: err.errorCode,
      message:   err.message,
    });
  }

  // Error de constraint de PostgreSQL
  if (err.code === '23505') {
    const detail = err.detail || '';
    let message   = 'Valor duplicado en la base de datos';
    let errorCode = 'E000';

    if (detail.includes('nombre_pais'))  { message = 'El nombre del país ya está registrado';  errorCode = ERROR_CODES.E001; }
    if (detail.includes('codigo_fifa'))  { message = 'El código FIFA ya está registrado';       errorCode = ERROR_CODES.E002; }
    if (detail.includes('uq_grupos'))    { message = 'El nombre del grupo ya está registrado';  errorCode = ERROR_CODES.E006; }

    return res.status(409).json({ status: 'error', errorCode, message });
  }

  // Error de check constraint de PostgreSQL
  if (err.code === '23514') {
    return res.status(400).json({
      status:    'error',
      errorCode: ERROR_CODES.E014,
      message:   'Los datos no cumplen las restricciones de la base de datos',
    });
  }

  // Error inesperado — no exponer detalles internos en producción
  console.error('ERROR NO OPERACIONAL:', err);

  return res.status(500).json({
    status:    'error',
    errorCode: ERROR_CODES.E014,
    message:   process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message,
  });
};

module.exports = errorHandler;