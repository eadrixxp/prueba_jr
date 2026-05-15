const { body } = require('express-validator');

const generarFormacionRules = [
  body('cantidadGrupos')
    .notEmpty().withMessage('La cantidad de grupos es requerida')
    .isInt({ min: 2 }).withMessage('Debe solicitar al menos 2 grupos'),
];

const guardarFormacionRules = [
  body('asignaciones')
    .isArray({ min: 1 }).withMessage('Se requiere al menos una asignación'),
  body('asignaciones.*.grupoId')
    .isInt({ min: 1 }).withMessage('Cada asignación debe tener un grupoId válido'),
  body('asignaciones.*.equipoId')
    .isInt({ min: 1 }).withMessage('Cada asignación debe tener un equipoId válido'),
];

module.exports = { generarFormacionRules, guardarFormacionRules };
