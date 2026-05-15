const { body, param } = require('express-validator');

const crearGrupoRules = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del grupo es requerido')
    .isString().withMessage('El nombre del grupo debe ser texto')
    .isLength({ max: 10 }).withMessage('El nombre del grupo no puede superar 10 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isString().withMessage('La descripción debe ser texto'),
];

const actualizarGrupoRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),

  ...crearGrupoRules,
];

const idParamRules = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
];

module.exports = { crearGrupoRules, actualizarGrupoRules, idParamRules };