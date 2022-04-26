const { response } = require("express");
const { request } = require("express");
const path = require('path');
const fs = require('fs');
const { subirArchivo } = require("../helpers/subir-archivo");
const { Producto, Usuario } = require('../models')

const cargarArchivo = async(req = request, res = response) => {
    try {
        const pathCompleto = await subirArchivo(req.files);
        res.json({
            fileName: pathCompleto
        })

    } catch (error) {
        res.status(400).json({ msg: error })
    }
}

const actualizarImagen = async(req = request, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `El Usuario con el id ${id} no existe`
                })
            }

            break;
        case 'productos':

            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `El Producto con el id ${id} no existe`
                })
            }

            break;

        default:
            return res.status(500).json({ msg: 'Colección no Permitida' });
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const pathCompleto = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = pathCompleto;

    await modelo.save();

    res.json({
        modelo
    })


}

const mostrarImagen = async(req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `El Usuario con el id ${id} no existe`
                })
            }

            break;
        case 'productos':

            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `El Producto con el id ${id} no existe`
                })
            }

            break;

        default:
            return res.status(500).json({ msg: 'Colección no Permitida' });
    }

    let pathImagen;

    if (modelo.img) {
        pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }

    pathImagen = path.join(__dirname, '../uploads', 'no-image.jpg');
    return res.sendFile(pathImagen);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}