const EquipoModel = require('../models/equipo.model');
const AppError = require('../utils/AppError');
const { ERROR_CODES, ERROR_MESSAGES } = require('../utils/errorCodes');

/**
 * Service de Equipos.
 * Solo lógica de negocio. No escribe SQL — delega al model.
 */
const EquiposService = {

  /**
   * Retorna todos los equipos activos.
   */
  getAll: async () => {
    const result = await EquipoModel.findAll();
    return result.rows;
  },

  /**
   * Retorna un equipo por ID. Lanza 404 si no existe.
   * @param {number} id
   */
  getById: async (id) => {
    const result = await EquipoModel.findById(id);
    if (!result.rows.length) {
      throw new AppError(ERROR_MESSAGES.E015, 404, ERROR_CODES.E015);
    }
    return result.rows[0];
  },

  /**
   * Crea un nuevo equipo validando unicidad de país y código FIFA.
   * @param {object} data
   */
  create: async (data) => {
    // Validar unicidad del nombre de país
    const porNombre = await EquipoModel.findByNombre(data.nombrePais);
    if (porNombre.rows.length) {
      throw new AppError(ERROR_MESSAGES.E001, 409, ERROR_CODES.E001);
    }

    // Validar unicidad del código FIFA
    const porCodigo = await EquipoModel.findByCodigo(data.codigoFifa);
    if (porCodigo.rows.length) {
      throw new AppError(ERROR_MESSAGES.E002, 409, ERROR_CODES.E002);
    }

    const result = await EquipoModel.create(data);
    return result.rows[0];
  },

  /**
   * Actualiza un equipo validando unicidad (excluyendo el propio registro).
   * @param {number} id
   * @param {object} data
   */
  update: async (id, data) => {
    // Verificar que el equipo existe
    const existe = await EquipoModel.findById(id);
    if (!existe.rows.length) {
      throw new AppError(ERROR_MESSAGES.E015, 404, ERROR_CODES.E015);
    }

    // Validar unicidad excluyendo el registro actual
    const porNombre = await EquipoModel.findByNombre(data.nombrePais, id);
    if (porNombre.rows.length) {
      throw new AppError(ERROR_MESSAGES.E001, 409, ERROR_CODES.E001);
    }

    const porCodigo = await EquipoModel.findByCodigo(data.codigoFifa, id);
    if (porCodigo.rows.length) {
      throw new AppError(ERROR_MESSAGES.E002, 409, ERROR_CODES.E002);
    }

    const result = await EquipoModel.update(id, data);
    return result.rows[0];
  },

  /**
   * Elimina lógicamente un equipo (estado = FALSE).
   * @param {number} id
   */
  softDelete: async (id) => {
    const result = await EquipoModel.softDelete(id);
    if (!result.rows.length) {
      throw new AppError(ERROR_MESSAGES.E015, 404, ERROR_CODES.E015);
    }
  },
};

module.exports = EquiposService;