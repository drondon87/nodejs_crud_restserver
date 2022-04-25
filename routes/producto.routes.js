const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductosGET, obtenerProductoByIdGET, crearProductoPOST, actualizarProductoPUT, borrarProductoDELETE } = require('../controllers/producto.controller');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, tieneRole } = require('../middlewares');

const router = Router();

// Obtener todos los Productos
router.get('/', obtenerProductosGET);

// Obtener un producto por Id
router.get('/:id', [
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProductoByIdGET);

// Crear Producto
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID Válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProductoPOST);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProductoPUT);

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProductoDELETE);

module.exports = router;