const express  = require('express');
const router   = express.Router();

const equiposRoutes  = require('./equipos.routes');
const gruposRoutes   = require('./grupos.routes');
const formacionRoutes = require('./formacion.routes');

router.use('/equipos',  equiposRoutes);
router.use('/grupos',   gruposRoutes);
router.use('/formacion', formacionRoutes);

module.exports = router;