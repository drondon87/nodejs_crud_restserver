const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETJWTKEY, {
            expiresIn: '2h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el Token');
            } else {
                resolve(token)
            }

        })

    });
}

const comprobarJWT = async(token = '') => {

    try {

        if (token < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRETJWTKEY);
        const usuario = await Usuario.findById(uid);

        if (!usuario || !usuario.estado) {
            return null;
        }

        return usuario;

    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}