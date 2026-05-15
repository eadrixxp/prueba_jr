const pool = require('../config/db');

const EquipoModel = {

  /**
   */
  findAll: () =>
    pool.query(
      `SELECT id, nombre_pais, codigo_fifa, director_tecnico,
              ranking_fifa, cantidad_jugadores, estado, created_at, updated_at
       FROM equipos
       WHERE estado = TRUE
       ORDER BY ranking_fifa ASC`,
    ),

  /**

   * @param {number} id
   */
  findById: (id) =>
    pool.query(
      `SELECT id, nombre_pais, codigo_fifa, director_tecnico,
              ranking_fifa, cantidad_jugadores, estado, created_at, updated_at
       FROM equipos
       WHERE id = $1 AND estado = TRUE`,
      [id],
    ),

  /**

   * @param {string} nombrePais
   * @param {number|null} excludeId - ID a excluir en actualizaciones
   */
  findByNombre: (nombrePais, excludeId = null) => {
    if (excludeId) {
      return pool.query(
        `SELECT id FROM equipos WHERE nombre_pais = $1 AND estado = TRUE AND id != $2`,
        [nombrePais, excludeId],
      );
    }
    return pool.query(
      `SELECT id FROM equipos WHERE nombre_pais = $1 AND estado = TRUE`,
      [nombrePais],
    );
  },

  /**
   * @param {string} codigoFifa
   * @param {number|null} excludeId - ID a excluir en actualizaciones
   */
  findByCodigo: (codigoFifa, excludeId = null) => {
    if (excludeId) {
      return pool.query(
        `SELECT id FROM equipos WHERE codigo_fifa = $1 AND estado = TRUE AND id != $2`,
        [codigoFifa, excludeId],
      );
    }
    return pool.query(
      `SELECT id FROM equipos WHERE codigo_fifa = $1 AND estado = TRUE`,
      [codigoFifa],
    );
  },

  findAllActivos: () =>
    pool.query(
      `SELECT id, nombre_pais, codigo_fifa, director_tecnico,
              ranking_fifa, cantidad_jugadores
       FROM equipos
       WHERE estado = TRUE
       ORDER BY id ASC`,
    ),

  /**
   * @param {object} data
   */
  create: ({ nombrePais, codigoFifa, directorTecnico, rankingFifa, cantidadJugadores }) =>
    pool.query(
      `INSERT INTO equipos (nombre_pais, codigo_fifa, director_tecnico, ranking_fifa, cantidad_jugadores)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre_pais, codigo_fifa, director_tecnico, ranking_fifa, cantidad_jugadores, estado, created_at, updated_at`,
      [nombrePais, codigoFifa, directorTecnico, rankingFifa, cantidadJugadores],
    ),

  /**
   * @param {number} id
   * @param {object} data
   */
  update: (id, { nombrePais, codigoFifa, directorTecnico, rankingFifa, cantidadJugadores }) =>
    pool.query(
      `UPDATE equipos
       SET nombre_pais = $1, codigo_fifa = $2, director_tecnico = $3,
           ranking_fifa = $4, cantidad_jugadores = $5
       WHERE id = $6 AND estado = TRUE
       RETURNING id, nombre_pais, codigo_fifa, director_tecnico, ranking_fifa, cantidad_jugadores, estado, created_at, updated_at`,
      [nombrePais, codigoFifa, directorTecnico, rankingFifa, cantidadJugadores, id],
    ),

  /**

   * @param {number} id
   */
  softDelete: (id) =>
    pool.query(
      `UPDATE equipos SET estado = FALSE WHERE id = $1 AND estado = TRUE RETURNING id`,
      [id],
    ),
};

module.exports = EquipoModel;