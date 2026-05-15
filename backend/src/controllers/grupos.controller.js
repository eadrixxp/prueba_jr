const GruposService = require('../services/grupos.service');
const asyncHandler  = require('../utils/asyncHandler');

/**
 * Controller de Grupos.
 * Solo gestiona HTTP: recibe req, llama al service y devuelve res.
 */

const getAllGrupos = asyncHandler(async (req, res) => {
  const grupos = await GruposService.getAllGrupos();
  res.status(200).json({
    status: 'success',
    total:  grupos.length,
    data:   grupos,
  });
});

const getGrupoById = asyncHandler(async (req, res) => {
  const grupo = await GruposService.getGrupoById(parseInt(req.params.id, 10));
  res.status(200).json({ status: 'success', data: grupo });
});

const createGrupo = asyncHandler(async (req, res) => {
  const grupo = await GruposService.createGrupo(req.body);
  res.status(201).json({
    status:  'success',
    message: 'Grupo creado exitosamente',
    data:    grupo,
  });
});

const updateGrupo = asyncHandler(async (req, res) => {
  const grupo = await GruposService.updateGrupo(parseInt(req.params.id, 10), req.body);
  res.status(200).json({
    status:  'success',
    message: 'Grupo actualizado exitosamente',
    data:    grupo,
  });
});

const deleteGrupo = asyncHandler(async (req, res) => {
  await GruposService.deleteGrupo(parseInt(req.params.id, 10));
  res.status(200).json({
    status:  'success',
    message: 'Grupo eliminado exitosamente',
  });
});

module.exports = { getAllGrupos, getGrupoById, createGrupo, updateGrupo, deleteGrupo };
