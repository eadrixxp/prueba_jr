const { body, param } = require('express-validator');

const crearEquipoRules = [
  body('nombrePais')
    .trim()
    .notEmpty().withMessage('El nombre del país es requerido')
    .isString().withMessage('El nombre del país debe ser texto')
    .isLength({ max: 100 }).withMessage('El nombre del país no puede superar 100 caracteres'),

  body('codigoFifa')
    .trim()
    .notEmpty().withMessage('El código FIFA es requerido')
    .matches(/^[A-Z]{3}$/).withMessage('El código FIFA debe tener exactamente 3 letras mayúsculas (ej: ARG)'),

  body('directorTecnico')
    .trim()
    .notEmpty().withMessage('El director técnico es requerido')
    .isString().withMessage('El director técnico debe ser texto')
    .isLength({ max: 100 }).withMessage('El nombre del director técnico no puede superar 100 caracteres'),

  body('rankingFifa')
    .notEmpty().withMessage('El ranking FIFA es requerido')
    .isInt({ min: 1 }).withMessage('El ranking FIFA debe ser un número entero mayor a 0'),

  body('cantidadJugadores')
    .notEmpty().withMessage('La cantidad de jugadores es requerida')
    .isInt({ min: 23, max: 26 }).withMessage('La cantidad de jugadores debe estar entre 23 y 26'),
];

const actualizarEquipoRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),

  ...crearEquipoRules,
];

const idParamRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
];

module.exports = { crearEquipoRules, actualizarEquipoRules, idParamRules };