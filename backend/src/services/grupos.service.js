const GrupoModel = require('../models/grupo.model');
const AppError = require('../utils/AppError');
const { ERROR_CODES, ERROR_MESSAGES } = require('../utils/errorCodes');

/**
 * Service de Grupos.
 * Solo lógica de negocio. No escribe SQL — delega al model.
 */
const GruposService = {

  /**
   * Retorna todos los grupos activos.
   */
  getAll: async () => {
    const result = await GrupoModel.findAll();
    return result.rows;
  },

  /**
   * Retorna un grupo por ID. Lanza 404 si no existe.
   * @param {number} id
   */
  getById: async (id) => {
    const result = await GrupoModel.findById(id);
    if (!result.rows.length) {
      throw new AppError(ERROR_MESSAGES.E007, 404, ERROR_CODES.E007);
    }
    return result.rows[0];
  },

  /**
   * Crea un nuevo grupo validando unicidad del nombre.
   * @param {object} data
   */
  create: async (data) => {
    const porNombre = await GrupoModel.findByNombre(data.nombre);
    if (porNombre.rows.length) {
      throw new AppError(ERROR_MESSAGES.E006, 409, ERROR_CODES.E006);
    }

    const result = await GrupoModel.create(data);
    return result.rows[0];
  },

  /**
   * Actualiza un grupo validando unicidad del nombre (excluyendo el propio registro).
   * @param {number} id
   * @param {object} data
   */
  update: async (id, data) => {
    const existe = await GrupoModel.findById(id);
    if (!existe.rows.length) {
      throw new AppError(ERROR_MESSAGES.E007, 404, ERROR_CODES.E007);
    }

    const porNombre = await GrupoModel.findByNombre(data.nombre, id);
    if (porNombre.rows.length) {
      throw new AppError(ERROR_MESSAGES.E006, 409, ERROR_CODES.E006);
    }

    const result = await GrupoModel.update(id, data);
    return result.rows[0];
  },

  /**
   * Elimina lógicamente un grupo (estado = FALSE).
   * @param {number} id
   */
  softDelete: async (id) => {
    const result = await GrupoModel.softDelete(id);
    if (!result.rows.length) {
      throw new AppError(ERROR_MESSAGES.E007, 404, ERROR_CODES.E007);
    }
  },
};

module.exports = GruposService;