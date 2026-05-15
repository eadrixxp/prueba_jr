const EquiposService = require('../services/equipos.service');
const asyncHandler  = require('../utils/asyncHandler');

/**
 * Controller de Equipos.
 * Solo gestiona HTTP: recibe req, llama al service y devuelve res.
 */

const getAll = asyncHandler(async (req, res) => {
  const equipos = await EquiposService.getAll();
  res.status(200).json({
    status: 'success',
    total:  equipos.length,
    data:   equipos,
  });
});

const getById = asyncHandler(async (req, res) => {
  const equipo = await EquiposService.getById(parseInt(req.params.id, 10));
  res.status(200).json({ status: 'success', data: equipo });
});

const create = asyncHandler(async (req, res) => {
  const equipo = await EquiposService.create(req.body);
  res.status(201).json({
    status:  'success',
    message: 'Equipo creado exitosamente',
    data:    equipo,
  });
});

const update = asyncHandler(async (req, res) => {
  const equipo = await EquiposService.update(parseInt(req.params.id, 10), req.body);
  res.status(200).json({
    status:  'success',
    message: 'Equipo actualizado exitosamente',
    data:    equipo,
  });
});

const softDelete = asyncHandler(async (req, res) => {
  await EquiposService.softDelete(parseInt(req.params.id, 10));
  res.status(200).json({
    status:  'success',
    message: 'Equipo eliminado exitosamente',
  });
});

module.exports = { getAll, getById, create, update, softDelete };