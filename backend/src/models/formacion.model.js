const pool = require('../config/db');

/**
 * Modelo de Formación de Grupos.
 * Gestiona la tabla formacion_grupos.
 * Todas las queries usan parámetros $1, $2… para prevenir SQL injection.
 */
const FormacionModel = {

  /**
   * Obtiene la formación actual con equipos por grupo.
   */
  findFormacionActual: () =>
    pool.query(
      `SELECT
         g.id        AS grupo_id,
         g.nombre    AS grupo,
         e.id        AS equipo_id,
         e.nombre_pais,
         e.codigo_fifa,
         e.director_tecnico,
         e.ranking_fifa,
         e.cantidad_jugadores
       FROM formacion_grupos fg
       JOIN grupos   g ON g.id = fg.grupo_id
       JOIN equipos  e ON e.id = fg.equipo_id
       WHERE fg.estado = TRUE
         AND g.estado  = TRUE
         AND e.estado  = TRUE
       ORDER BY g.nombre ASC, e.ranking_fifa ASC`,
    ),

  /**
   * Genera la asignación aleatoria completa dentro de una transacción.
   * 1. Elimina asignaciones previas.
   * 2. Inserta las nuevas asignaciones.
   *
   * @param {Array<{grupoId: number, equipoId: number}>} asignaciones
   */
  generarFormacion: async (asignaciones) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Limpia asignaciones previas (borrado físico para permitir regenerar)
      await client.query(`DELETE FROM formacion_grupos`);

      // Inserta cada asignación con parámetros separados
      for (const { grupoId, equipoId } of asignaciones) {
        await client.query(
          `INSERT INTO formacion_grupos (grupo_id, equipo_id) VALUES ($1, $2)`,
          [grupoId, equipoId],
        );
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};

module.exports = FormacionModel;