const EquipoModel    = require('../models/equipo.model');
const GrupoModel     = require('../models/grupo.model');
const FormacionModel = require('../models/formacion.model');
const AppError       = require('../utils/AppError');
const shuffle        = require('../utils/shuffle');
const { ERROR_CODES, ERROR_MESSAGES } = require('../utils/errorCodes');

/**
 * Valida reglas de negocio y construye la asignación aleatoria.
 * Reutilizado por preview y generar.
 * @returns {{ formacionAgrupada: Array, asignaciones: Array }}
 */
async function _buildFormacion(cantidadGrupos) {
  if (cantidadGrupos < 2) {
    throw new AppError(ERROR_MESSAGES.E012, 400, ERROR_CODES.E012);
  }

  const totalGruposResult = await GrupoModel.countActivos();
  const totalGrupos = Number.parseInt(totalGruposResult.rows[0].total, 10);

  if (cantidadGrupos > totalGrupos) {
    throw new AppError(
      `${ERROR_MESSAGES.E008}. Grupos disponibles: ${totalGrupos}`,
      400,
      ERROR_CODES.E008,
    );
  }

  const equiposResult = await EquipoModel.findAllActivos();
  const equipos = equiposResult.rows;

  const gruposResult = await GrupoModel.findAllActivos();
  const grupos = gruposResult.rows.slice(0, cantidadGrupos);

  if (equipos.length < cantidadGrupos * 2) {
    throw new AppError(
      `${ERROR_MESSAGES.E011}. Se necesitan al menos ${cantidadGrupos * 2} equipos para ${cantidadGrupos} grupos`,
      400,
      ERROR_CODES.E011,
    );
  }

  if (equipos.length % cantidadGrupos !== 0) {
    throw new AppError(
      `${ERROR_MESSAGES.E009}. Equipos: ${equipos.length}, grupos: ${cantidadGrupos}. Residuo: ${equipos.length % cantidadGrupos}`,
      400,
      ERROR_CODES.E009,
    );
  }

  if (cantidadGrupos === 1) {
    throw new AppError(ERROR_MESSAGES.E010, 400, ERROR_CODES.E010);
  }

  const equiposMezclados = shuffle(equipos);
  const equiposPorGrupo  = equipos.length / cantidadGrupos;

  const asignaciones     = [];
  const formacionAgrupada = [];

  grupos.forEach((grupo, index) => {
    const inicio = index * equiposPorGrupo;
    const fin    = inicio + equiposPorGrupo;
    const equiposDelGrupo = equiposMezclados.slice(inicio, fin);

    equiposDelGrupo.forEach((equipo) => {
      asignaciones.push({ grupoId: grupo.id, equipoId: equipo.id });
    });

    formacionAgrupada.push({
      grupo:   grupo.nombre,
      equipos: equiposDelGrupo,
    });
  });

  return { formacionAgrupada, asignaciones };
}

const FormacionService = {

  /**
   * Genera y persiste la asignación de equipos a grupos.
   */
  generarFormacion: async (cantidadGrupos) => {
    const { formacionAgrupada, asignaciones } = await _buildFormacion(cantidadGrupos);
    await FormacionModel.generarFormacion(asignaciones);
    return formacionAgrupada;
  },

  /**
   * Genera la asignación sin persistirla (vista previa).
   * Devuelve la formación agrupada y las asignaciones para guardar después.
   */
  previsualizarFormacion: async (cantidadGrupos) => {
    return _buildFormacion(cantidadGrupos);
  },

  /**
   * Persiste una formación ya construida (asignaciones obtenidas del preview).
   */
  guardarFormacion: async (asignaciones) => {
    await FormacionModel.generarFormacion(asignaciones);
  },

  /**
   * Retorna la formación actual guardada en BD.
   */
  getFormacionActual: async () => {
    const result = await FormacionModel.findFormacionActual();
    if (!result.rows.length) return [];

    const mapa = new Map();
    result.rows.forEach((row) => {
      if (!mapa.has(row.grupo)) {
        mapa.set(row.grupo, { grupo: row.grupo, equipos: [] });
      }
      mapa.get(row.grupo).equipos.push({
        id:                 row.equipo_id,
        nombre_pais:        row.nombre_pais,
        codigo_fifa:        row.codigo_fifa,
        director_tecnico:   row.director_tecnico,
        ranking_fifa:       row.ranking_fifa,
        cantidad_jugadores: row.cantidad_jugadores,
      });
    });

    return Array.from(mapa.values());
  },
};

module.exports = FormacionService;
