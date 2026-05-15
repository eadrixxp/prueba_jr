const { body } = require('express-validator');

const generarFormacionRules = [
  body('cantidadGrupos')
    .notEmpty().withMessage('La cantidad de grupos es requerida')
    .isInt({ min: 2 }).withMessage('Debe solicitar al menos 2 grupos'),
];

module.exports = { generarFormacionRules };