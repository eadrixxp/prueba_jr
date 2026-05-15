const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/formacion.controller');
const validate = require('../middlewares/validate');
const { generarFormacionRules, guardarFormacionRules } = require('../validations/formacion.validation');

router.get('/',           ctrl.getFormacionActual);
router.post('/generar',   generarFormacionRules,    validate, ctrl.generarFormacion);
router.post('/preview',   generarFormacionRules,    validate, ctrl.previsualizarFormacion);
router.post('/guardar',   guardarFormacionRules,    validate, ctrl.guardarFormacion);

module.exports = router;
