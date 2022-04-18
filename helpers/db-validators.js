const bcryptjs = require('bcryptjs');
const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
}

const emailExiste = async(correo = '') => {
    const existeMail = await Usuario.findOne({ correo });
    if (existeMail) {
        throw new Error(`El email ${email} ya se encuentra registrado`)
    }
}

const getPasswordEncript = (password = '') => {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync(password, salt);
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El ID ${id} no se encuentra registrado`)
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    getPasswordEncript,
    existeUsuarioPorId
}