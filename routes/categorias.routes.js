const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoriaPOST, obtenerCategoriasGET, obtenerCategoriaByIdGET, actualizarCategoriaPUT, borrarCategoriaDELETE } = require('../controllers/categoria.controller');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const router = Router();

// Obtener todas las Categorias
router.get('/', obtenerCategoriasGET);

// Obtener una categoria por Id
router.get('/:id', [
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoriaByIdGET);

// Crear categoría - privado - cualquier persona con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoriaPOST);

// Actualizar - privado - cualquier con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoriaPUT);

// Borrar Categoría si es Admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID Válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoriaDELETE);


module.exports = router;