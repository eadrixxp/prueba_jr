const EquiposService = require('../services/equipos.service');
const asyncHandler  = require('../utils/asyncHandler');

/**
 * Controller de Equipos.
 * Solo gestiona HTTP: recibe req, llama al service y devuelve res.
 */

const getAllEquipos = asyncHandler(async (req, res) => {
  const equipos = await EquiposService.getAllEquipos();
  res.status(200).json({
    status: 'success',
    total:  equipos.length,
    data:   equipos,
  });
});

const getEquipoById = asyncHandler(async (req, res) => {
  const equipo = await EquiposService.getEquipoById(parseInt(req.params.id, 10));
  res.status(200).json({ status: 'success', data: equipo });
});

const createEquipo = asyncHandler(async (req, res) => {
  const equipo = await EquiposService.createEquipo(req.body);
  res.status(201).json({
    status:  'success',
    message: 'Equipo creado exitosamente',
    data:    equipo,
  });
});

const updateEquipo = asyncHandler(async (req, res) => {
  const equipo = await EquiposService.updateEquipo(parseInt(req.params.id, 10), req.body);
  res.status(200).json({
    status:  'success',
    message: 'Equipo actualizado exitosamente',
    data:    equipo,
  });
});

const deleteEquipo = asyncHandler(async (req, res) => {
  await EquiposService.deleteEquipo(parseInt(req.params.id, 10));
  res.status(200).json({
    status:  'success',
    message: 'Equipo eliminado exitosamente',
  });
});

module.exports = { getAllEquipos, getEquipoById, createEquipo, updateEquipo, deleteEquipo };
