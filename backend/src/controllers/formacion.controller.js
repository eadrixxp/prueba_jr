const FormacionService = require('../services/formacion.service');
const asyncHandler     = require('../utils/asyncHandler');

/**
 * Controller de Formación de Grupos.
 * Solo gestiona HTTP: recibe req, llama al service y devuelve res.
 */

const generar = asyncHandler(async (req, res) => {
  const { cantidadGrupos } = req.body;
  const formacion = await FormacionService.generar(parseInt(cantidadGrupos, 10));

  res.status(200).json({
    status:  'success',
    message: 'Formación de grupos generada exitosamente',
    data:    formacion,
  });
});

const getFormacionActual = asyncHandler(async (req, res) => {
  const formacion = await FormacionService.getFormacionActual();
  res.status(200).json({
    status: 'success',
    data:   formacion,
  });
});

module.exports = { generar, getFormacionActual };