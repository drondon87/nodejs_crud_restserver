const { Router } = require('express');
const { buscarGET } = require('../controllers/buscar.controller');

const router = Router();

router.get('/:coleccion/:termino', buscarGET);

module.exports = router;