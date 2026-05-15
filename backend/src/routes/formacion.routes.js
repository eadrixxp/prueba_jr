const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/formacion.controller');
const validate = require('../middlewares/validate');
const { generarFormacionRules } = require('../validations/formacion.validation');

/**
 * @swagger
 * tags:
 *   name: Formación
 *   description: Asignación aleatoria de equipos a grupos
 */

/**
 * @swagger
 * /formacion:
 *   get:
 *     summary: Obtener la formación de grupos actual
 *     tags: [Formación]
 *     responses:
 *       200:
 *         description: Formación actual guardada en base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       grupo:   { type: string, example: Grupo A }
 *                       equipos: { type: array, items: { $ref: '#/components/schemas/Equipo' } }
 */
router.get('/', ctrl.getFormacionActual);

/**
 * @swagger
 * /formacion/generar:
 *   post:
 *     summary: Generar asignación aleatoria de equipos a grupos
 *     tags: [Formación]
 *     description: |
 *       Genera una nueva asignación aleatoria de equipos a grupos.
 *
 *       **Validaciones de negocio:**
 *       - La cantidad de grupos debe ser mínimo 2.
 *       - La cantidad solicitada no puede superar los grupos registrados en BD.
 *       - Los equipos registrados deben ser divisibles entre la cantidad de grupos (sin residuo).
 *       - No deben quedar equipos sin asignar.
 *       - No se puede formar un solo grupo con todos los equipos.
 *
 *       Cada vez que se ejecuta, **reemplaza** la formación anterior.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/FormacionInput' }
 *           example:
 *             cantidadGrupos: 4
 *     responses:
 *       200:
 *         description: Formación generada exitosamente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FormacionResult' }
 *       400:
 *         description: Error de validación de negocio
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *             examples:
 *               noDivisible:
 *                 summary: Equipos no divisibles
 *                 value:
 *                   status: error
 *                   errorCode: E009
 *                   message: Los equipos registrados no son divisibles entre la cantidad de grupos solicitada
 *               superaGrupos:
 *                 summary: Supera grupos registrados
 *                 value:
 *                   status: error
 *                   errorCode: E008
 *                   message: La cantidad de grupos solicitada supera los grupos registrados en base de datos
 *       422:
 *         description: Error de validación de campos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 */
router.post('/generar', generarFormacionRules, validate, ctrl.generarFormacion);

module.exports = router;