const { response } = require('express');
const { request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETJWTKEY);
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no existe en DB'
            })
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado: false'
            })
        }

        req.usuario = usuario;

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

    next();

}

module.exports = {
    validarJWT
}