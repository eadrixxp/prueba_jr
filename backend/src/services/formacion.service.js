const EquipoModel  = require('../models/equipo.model');
const GrupoModel   = require('../models/grupo.model');
const FormacionModel = require('../models/formacion.model');
const AppError     = require('../utils/AppError');
const shuffle      = require('../utils/shuffle');
const { ERROR_CODES, ERROR_MESSAGES } = require('../utils/errorCodes');

/**
 * Service de Formación de Grupos.
 * Contiene todas las validaciones de negocio para la asignación aleatoria.
 */
const FormacionService = {

  /**
   * Genera la asignación aleatoria de equipos a grupos.
   *
   * Validaciones:
   * 1. Debe haber al menos 2 grupos solicitados.
   * 2. La cantidad solicitada no puede superar los grupos registrados en BD.
   * 3. Debe haber suficientes equipos registrados (al menos 2 por grupo).
   * 4. Los equipos deben ser divisibles entre los grupos (sin residuo).
   * 5. No se puede formar un solo grupo con todos los equipos.
   *
   * @param {number} cantidadGrupos
   * @returns {Array} Formación agrupada
   */
  generar: async (cantidadGrupos) => {
    // --- Validación 1: mínimo 2 grupos ---
    if (cantidadGrupos < 2) {
      throw new AppError(ERROR_MESSAGES.E012, 400, ERROR_CODES.E012);
    }

    // --- Validación 2: no superar grupos registrados en BD ---
    const totalGruposResult = await GrupoModel.countActivos();
    const totalGrupos = parseInt(totalGruposResult.rows[0].total, 10);

    if (cantidadGrupos > totalGrupos) {
      throw new AppError(
        `${ERROR_MESSAGES.E008}. Grupos disponibles: ${totalGrupos}`,
        400,
        ERROR_CODES.E008,
      );
    }

    // --- Obtener equipos y grupos activos ---
    const equiposResult = await EquipoModel.findAllActivos();
    const equipos = equiposResult.rows;

    const gruposResult = await GrupoModel.findAllActivos();
    const grupos = gruposResult.rows.slice(0, cantidadGrupos); // Solo los solicitados

    // --- Validación 3: suficientes equipos ---
    if (equipos.length < cantidadGrupos * 2) {
      throw new AppError(
        `${ERROR_MESSAGES.E011}. Se necesitan al menos ${cantidadGrupos * 2} equipos para ${cantidadGrupos} grupos`,
        400,
        ERROR_CODES.E011,
      );
    }

    // --- Validación 4: divisibilidad sin residuo ---
    if (equipos.length % cantidadGrupos !== 0) {
      throw new AppError(
        `${ERROR_MESSAGES.E009}. Equipos: ${equipos.length}, grupos: ${cantidadGrupos}. Residuo: ${equipos.length % cantidadGrupos}`,
        400,
        ERROR_CODES.E009,
      );
    }

    // --- Validación 5: no un solo grupo con todos ---
    if (cantidadGrupos === 1) {
      throw new AppError(ERROR_MESSAGES.E010, 400, ERROR_CODES.E010);
    }

    // --- Asignación aleatoria con Fisher-Yates ---
    const equiposMezclados = shuffle(equipos);
    const equiposPorGrupo  = equipos.length / cantidadGrupos;

    const asignaciones = [];
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

    // --- Persistir en transacción ---
    await FormacionModel.generarFormacion(asignaciones);

    return formacionAgrupada;
  },

  /**
   * Retorna la formación actual guardada en BD.
   */
  getFormacionActual: async () => {
    const result = await FormacionModel.findFormacionActual();
    if (!result.rows.length) return [];

    // Agrupar resultado de la query plana en estructura anidada
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