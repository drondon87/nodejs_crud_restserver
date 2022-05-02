const bcryptjs = require('bcryptjs');
const { response, request } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
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
            ok: false,
            msg: 'Error al intentar loggear con google'
        });
    }
}

const googleSignIn = async(req = request, res = response) => {

    const { id_token } = req.body;
    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            }
            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en BD existe
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el Administrador, usuario Bloqueado'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({ usuario, token })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al intentar loggear'
        });
    }
}

const renovarToken = async(req = request, res = response) => {

    const { usuario } = req;

    const token = await generarJWT(usuario._id);

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}