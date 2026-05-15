const FormacionService = require('../services/formacion.service');
const asyncHandler     = require('../utils/asyncHandler');

const generarFormacion = asyncHandler(async (req, res) => {
  const { cantidadGrupos } = req.body;
  const formacion = await FormacionService.generarFormacion(Number.parseInt(cantidadGrupos, 10));

  res.status(200).json({
    status:  'success',
    message: 'Formación de grupos generada y guardada exitosamente',
    data:    formacion,
  });
});

const previsualizarFormacion = asyncHandler(async (req, res) => {
  const { cantidadGrupos } = req.body;
  const { formacionAgrupada, asignaciones } = await FormacionService.previsualizarFormacion(
    Number.parseInt(cantidadGrupos, 10),
  );

  res.status(200).json({
    status:  'success',
    message: 'Vista previa generada. La formación aún no ha sido guardada.',
    data:    { formacion: formacionAgrupada, asignaciones },
  });
});

const guardarFormacion = asyncHandler(async (req, res) => {
  const { asignaciones } = req.body;
  await FormacionService.guardarFormacion(asignaciones);

  res.status(200).json({
    status:  'success',
    message: 'Formación guardada correctamente',
  });
});

const getFormacionActual = asyncHandler(async (req, res) => {
  const formacion = await FormacionService.getFormacionActual();
  res.status(200).json({
    status: 'success',
    data:   formacion,
  });
});

module.exports = { generarFormacion, previsualizarFormacion, guardarFormacion, getFormacionActual };
