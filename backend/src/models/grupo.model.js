const pool = require('../config/db');

/**
 * Modelo de Grupos.
 * Única capa que accede a la base de datos.
 * Todas las queries usan parámetros $1, $2… para prevenir SQL injection.
 */
const GrupoModel = {

  /**
   * Obtiene todos los grupos activos.
   */
  findAll: () =>
    pool.query(
      `SELECT id, nombre, descripcion, estado, created_at, updated_at
       FROM grupos
       WHERE estado = TRUE
       ORDER BY nombre ASC`,
    ),

  /**
   * Busca un grupo por ID (solo activos).
   * @param {number} id
   */
  findById: (id) =>
    pool.query(
      `SELECT id, nombre, descripcion, estado, created_at, updated_at
       FROM grupos
       WHERE id = $1 AND estado = TRUE`,
      [id],
    ),

  /**
   * Busca un grupo por nombre (para validar unicidad).
   * @param {string} nombre
   * @param {number|null} excludeId - ID a excluir en actualizaciones
   */
  findByNombre: (nombre, excludeId = null) => {
    if (excludeId) {
      return pool.query(
        `SELECT id FROM grupos WHERE nombre = $1 AND estado = TRUE AND id != $2`,
        [nombre, excludeId],
      );
    }
    return pool.query(
      `SELECT id FROM grupos WHERE nombre = $1 AND estado = TRUE`,
      [nombre],
    );
  },

  /**
   * Cuenta los grupos activos registrados en BD.
   */
  countActivos: () =>
    pool.query(
      `SELECT COUNT(*) AS total FROM grupos WHERE estado = TRUE`,
    ),

  /**
   * Obtiene todos los grupos activos con sus IDs para la formación.
   */
  findAllActivos: () =>
    pool.query(
      `SELECT id, nombre, descripcion
       FROM grupos
       WHERE estado = TRUE
       ORDER BY nombre ASC`,
    ),

  /**
   * Crea un nuevo grupo.
   * @param {object} data
   */
  create: ({ nombre, descripcion }) =>
    pool.query(
      `INSERT INTO grupos (nombre, descripcion)
       VALUES ($1, $2)
       RETURNING id, nombre, descripcion, estado, created_at, updated_at`,
      [nombre, descripcion || null],
    ),

  /**
   * Actualiza un grupo existente.
   * @param {number} id
   * @param {object} data
   */
  update: (id, { nombre, descripcion }) =>
    pool.query(
      `UPDATE grupos
       SET nombre = $1, descripcion = $2
       WHERE id = $3 AND estado = TRUE
       RETURNING id, nombre, descripcion, estado, created_at, updated_at`,
      [nombre, descripcion || null, id],
    ),

  /**
   * Borrado lógico de un grupo (estado = FALSE).
   * @param {number} id
   */
  softDelete: (id) =>
    pool.query(
      `UPDATE grupos SET estado = FALSE WHERE id = $1 AND estado = TRUE RETURNING id`,
      [id],
    ),
};

module.exports = GrupoModel;