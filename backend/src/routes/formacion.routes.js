const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/formacion.controller');
const validate = require('../middlewares/validate');
const { generarFormacionRules, guardarFormacionRules } = require('../validations/formacion.validation');

/**
 * @swagger
 * tags:
 *   name: Formacion
 *   description: Generación y gestión de la formación de grupos del Mundial
 */

/**
 * @swagger
 * /formacion:
 *   get:
 *     summary: Obtener la formación de grupos actual
 *     tags: [Formacion]
 *     responses:
 *       200:
 *         description: Formación actual de grupos y equipos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   description: Formación agrupada por grupos con sus equipos asignados
 */
router.get('/',           ctrl.getFormacionActual);

/**
 * @swagger
 * /formacion/generar:
 *   post:
 *     summary: Generar y guardar una formación de grupos automáticamente
 *     tags: [Formacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cantidadGrupos]
 *             properties:
 *               cantidadGrupos:
 *                 type: integer
 *                 minimum: 2
 *                 example: 8
 *                 description: Número de grupos a generar (mínimo 2)
 *     responses:
 *       200:
 *         description: Formación generada y guardada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:  { type: string, example: success }
 *                 message: { type: string, example: Formación de grupos generada y guardada exitosamente }
 *                 data:
 *                   type: object
 *                   description: Formación generada agrupada por grupos
 *       422:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 */
router.post('/generar',   generarFormacionRules,    validate, ctrl.generarFormacion);

/**
 * @swagger
 * /formacion/preview:
 *   post:
 *     summary: Previsualizar una formación de grupos sin guardarla
 *     tags: [Formacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cantidadGrupos]
 *             properties:
 *               cantidadGrupos:
 *                 type: integer
 *                 minimum: 2
 *                 example: 8
 *                 description: Número de grupos a previsualizar (mínimo 2)
 *     responses:
 *       200:
 *         description: Vista previa generada (la formación aún no ha sido guardada)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:  { type: string, example: success }
 *                 message: { type: string, example: Vista previa generada. La formación aún no ha sido guardada. }
 *                 data:
 *                   type: object
 *                   properties:
 *                     formacion:
 *                       type: object
 *                       description: Formación agrupada por grupos
 *                     asignaciones:
 *                       type: array
 *                       description: Lista de asignaciones equipo-grupo
 *                       items:
 *                         type: object
 *                         properties:
 *                           grupoId:  { type: integer, example: 1 }
 *                           equipoId: { type: integer, example: 5 }
 *       422:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 */
router.post('/preview',   generarFormacionRules,    validate, ctrl.previsualizarFormacion);

/**
 * @swagger
 * /formacion/guardar:
 *   post:
 *     summary: Guardar una formación de grupos a partir de asignaciones previas
 *     tags: [Formacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [asignaciones]
 *             properties:
 *               asignaciones:
 *                 type: array
 *                 minItems: 1
 *                 description: Lista de asignaciones equipo-grupo a persistir
 *                 items:
 *                   type: object
 *                   required: [grupoId, equipoId]
 *                   properties:
 *                     grupoId:  { type: integer, minimum: 1, example: 1 }
 *                     equipoId: { type: integer, minimum: 1, example: 5 }
 *     responses:
 *       200:
 *         description: Formación guardada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:  { type: string, example: success }
 *                 message: { type: string, example: Formación guardada correctamente }
 *       422:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 */
router.post('/guardar',   guardarFormacionRules,    validate, ctrl.guardarFormacion);

module.exports = router;
