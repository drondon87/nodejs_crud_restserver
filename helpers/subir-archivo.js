const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Producto, Usuario } = require('../models')

const extensionesValidas = ['jpg', 'png', 'gif'];

const subirArchivo = (files, validExtensions = extensionesValidas, carpeta = '') => {
    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        // Validar Extension
        const extensionPermitidas = validExtensions;

        if (!extensionPermitidas.includes(extension)) {
            return reject(`La extension ${extension} no está permitida`);
        }

        const nombreTmpFile = uuidv4() + '.' + extension;

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTmpFile);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreTmpFile);
        });
    });
}

module.exports = {
    subirArchivo
}