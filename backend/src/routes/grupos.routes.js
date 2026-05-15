const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/grupos.controller');
const validate = require('../middlewares/validate');
const { crearGrupoRules, actualizarGrupoRules, idParamRules } = require('../validations/grupo.validation');

/**
 * @swagger
 * tags:
 *   name: Grupos
 *   description: CRUD de grupos del Mundial
 */

/**
 * @swagger
 * /grupos:
 *   get:
 *     summary: Listar todos los grupos activos
 *     tags: [Grupos]
 *     responses:
 *       200:
 *         description: Lista de grupos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 total:  { type: integer, example: 8 }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Grupo' }
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /grupos/{id}:
 *   get:
 *     summary: Obtener un grupo por ID
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del grupo
 *     responses:
 *       200:
 *         description: Grupo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:   { $ref: '#/components/schemas/Grupo' }
 *       404:
 *         description: Grupo no encontrado
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
 * /grupos:
 *   post:
 *     summary: Crear un nuevo grupo
 *     tags: [Grupos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GrupoInput' }
 *     responses:
 *       201:
 *         description: Grupo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:  { type: string, example: success }
 *                 message: { type: string, example: Grupo creado exitosamente }
 *                 data:    { $ref: '#/components/schemas/Grupo' }
 *       409:
 *         description: Nombre de grupo duplicado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       422:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 */
router.post('/', crearGrupoRules, validate, ctrl.create);

/**
 * @swagger
 * /grupos/{id}:
 *   put:
 *     summary: Actualizar un grupo existente
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del grupo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GrupoInput' }
 *     responses:
 *       200:
 *         description: Grupo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:  { type: string, example: success }
 *                 message: { type: string, example: Grupo actualizado exitosamente }
 *                 data:    { $ref: '#/components/schemas/Grupo' }
 *       404:
 *         description: Grupo no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       409:
 *         description: Nombre de grupo duplicado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       422:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
 */
router.put('/:id', actualizarGrupoRules, validate, ctrl.update);

/**
 * @swagger
 * /grupos/{id}:
 *   delete:
 *     summary: Eliminar un grupo (borrado lógico)
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del grupo a eliminar
 *     responses:
 *       200:
 *         description: Grupo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:  { type: string, example: success }
 *                 message: { type: string, example: Grupo eliminado exitosamente }
 *       404:
 *         description: Grupo no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.delete('/:id', idParamRules, validate, ctrl.softDelete);

module.exports = router;