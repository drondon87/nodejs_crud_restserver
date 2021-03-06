const { response } = require("express");
const { request } = require("express");
const { Producto } = require('../models')

const obtenerProductosGET = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })
}

const obtenerProductoByIdGET = async(req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

    if (!producto) {
        return res.status(500).json({
            msg: `El Producto con id ${id} no existe`
        })
    }
    res.json(producto)
}

const crearProductoPOST = async(req = request, res = response) => {

    /* const productoBD = await Producto.findOne({ nombre });

    if (productoBD) {
        return res.status(400).json({
            msg: `El Producto ${productoBD.nombre} ya existe`
        })
    } */

    const { estado, usuario, ...body } = req.body;

    // Generar la data a Guardar
    const data = {
        ...body,
        nombre: req.body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto);

}

const actualizarProductoPUT = async(req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto)
}

const borrarProductoDELETE = async(req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false });

    res.json(producto);
}

module.exports = {
    obtenerProductosGET,
    obtenerProductoByIdGET,
    crearProductoPOST,
    actualizarProductoPUT,
    borrarProductoDELETE
}