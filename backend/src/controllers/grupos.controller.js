const GruposService = require('../services/grupos.service');
const asyncHandler  = require('../utils/asyncHandler');

/**
 * Controller de Grupos.
 * Solo gestiona HTTP: recibe req, llama al service y devuelve res.
 */

const getAll = asyncHandler(async (req, res) => {
  const grupos = await GruposService.getAll();
  res.status(200).json({
    status: 'success',
    total:  grupos.length,
    data:   grupos,
  });
});

const getById = asyncHandler(async (req, res) => {
  const grupo = await GruposService.getById(parseInt(req.params.id, 10));
  res.status(200).json({ status: 'success', data: grupo });
});

const create = asyncHandler(async (req, res) => {
  const grupo = await GruposService.create(req.body);
  res.status(201).json({
    status:  'success',
    message: 'Grupo creado exitosamente',
    data:    grupo,
  });
});

const update = asyncHandler(async (req, res) => {
  const grupo = await GruposService.update(parseInt(req.params.id, 10), req.body);
  res.status(200).json({
    status:  'success',
    message: 'Grupo actualizado exitosamente',
    data:    grupo,
  });
});

const softDelete = asyncHandler(async (req, res) => {
  await GruposService.softDelete(parseInt(req.params.id, 10));
  res.status(200).json({
    status:  'success',
    message: 'Grupo eliminado exitosamente',
  });
});

module.exports = { getAll, getById, create, update, softDelete };