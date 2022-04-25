const { response } = require("express");
const { request } = require("express");
const { Categoria } = require('../models')

const obtenerCategoriasGET = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    })
}

const obtenerCategoriaByIdGET = async(req = request, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    if (!categoria) {
        return res.status(500).json({
            msg: `La Categoria con id ${id} no existe`
        })
    }
    res.json(categoria)
}


const crearCategoriaPOST = async(req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaBD = await Categoria.findOne({ nombre });

    if (categoriaBD) {
        return res.status(400).json({
            msg: `La Categoria ${categoriaBD.nombre} ya existe`
        })
    }

    // Generar la data a Guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);

}

const actualizarCategoriaPUT = async(req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json(categoria)
}

// borrar categoria - estado: false

const borrarCategoriaDELETE = async(req = request, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

    res.json(categoria);
}

module.exports = {
    obtenerCategoriasGET,
    obtenerCategoriaByIdGET,
    crearCategoriaPOST,
    actualizarCategoriaPUT,
    borrarCategoriaDELETE
}