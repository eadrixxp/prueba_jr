const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/equipos.controller');
const validate = require('../middlewares/validate');
const { crearEquipoRules, actualizarEquipoRules, idParamRules } = require('../validations/equipo.validation');

/**
 * @swagger
 * tags:
 *   name: Equipos
 *   description: CRUD de equipos participantes del Mundial
 */

/**
 * @swagger
 * /equipos:
 *   get:
 *     summary: Listar todos los equipos activos
 *     tags: [Equipos]
 *     responses:
 *       200:
 *         description: Lista de equipos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 total:  { type: integer, example: 3 }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Equipo' }
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /equipos/{id}:
 *   get:
 *     summary: Obtener un equipo por ID
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del equipo
 *     responses:
 *       200:
 *         description: Equipo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:   { $ref: '#/components/schemas/Equipo' }
 *       404:
 *         description: Equipo no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       422:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 */
router.get('/:id', idParamRules, validate, ctrl.getById);

/**
 * @swagger
 * /equipos:
 *   post:
 *     summary: Crear un nuevo equipo
 *     tags: [Equipos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/EquipoInput' }
 *     responses:
 *       201:
 *         description: Equipo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:  { type: string, example: success }
 *                 message: { type: string, example: Equipo creado exitosamente }
 *                 data:    { $ref: '#/components/schemas/Equipo' }
 *       409:
 *         description: País o código FIFA duplicado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       422:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 */
router.post('/', crearEquipoRules, validate, ctrl.create);

/**
 * @swagger
 * /equipos/{id}:
 *   put:
 *     summary: Actualizar un equipo existente
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del equipo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/EquipoInput' }
 *     responses:
 *       200:
 *         description: Equipo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:  { type: string, example: success }
 *                 message: { type: string, example: Equipo actualizado exitosamente }
 *                 data:    { $ref: '#/components/schemas/Equipo' }
 *       404:
 *         description: Equipo no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       409:
 *         description: País o código FIFA duplicado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       422:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 */
router.put('/:id', actualizarEquipoRules, validate, ctrl.update);

/**
 * @swagger
 * /equipos/{id}:
 *   delete:
 *     summary: Eliminar un equipo (borrado lógico)
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del equipo a eliminar
 *     responses:
 *       200:
 *         description: Equipo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:  { type: string, example: success }
 *                 message: { type: string, example: Equipo eliminado exitosamente }
 *       404:
 *         description: Equipo no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.delete('/:id', idParamRules, validate, ctrl.softDelete);

module.exports = router;