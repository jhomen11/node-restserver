const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos"];

//* BUSCAR USUARIOS
const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, 'i')
  const usuarios = await Usuario.find({
    $or:[{nombre: regex}, {correo: regex}],
    $and: [{estado: true}]
  })

  return res.json({
    results: usuarios,
  });
};

//* BUSCAR CATEGORIAS
const buscarCategorias = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const categorias = await Categoria.findById(termino);
    return res.json({
      results: categorias ? [categorias] : [],
    });
  }

  const regex = new RegExp(termino, 'i')
  const categorias = await Categoria.find({nombre: regex, estado: true })

  return res.json({
    results: categorias,
  });
};
//* BUSCAR PRODUCTOS
const buscarProductos = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const productos = await Producto.findById(termino).populate('categoria', 'nombre');
    return res.json({
      results: productos ? [productos] : [],
    });
  }

  const regex = new RegExp(termino, 'i')
  const productos = await Producto.find({nombre: regex, estado: true}).populate('categoria', 'nombre')

  return res.json({
    results: productos,
  });
};

const buscar = (req = request, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `La coleccion ${coleccion} no existe`,
    });
  }
  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
        buscarCategorias(termino, res)
      break;
    case "productos":
        buscarProductos(termino, res)
      break;

    default:
      res.status(500).json({
        msg: "Contacte al administrador",
      });
  }
};
module.exports = {
  buscar,
};
