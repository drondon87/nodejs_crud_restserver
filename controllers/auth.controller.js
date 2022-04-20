const bcryptjs = require('bcryptjs');
const { response, request } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario.model');

const login = async(req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Verificar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al intentar loggear'
        });
    }
}

module.exports = {
    login
}