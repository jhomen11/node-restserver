const { response, request } = require("express");
const { Categoria, Usuario } = require("../models");

//* OBTENER CATEGORIAS
const obtenerCategorias = async (req = request, res = response) => {
  const query = { estado: true };

  const { limite, desde = 0 } = req.query;

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({ categorias, total });
};

//* OBTENER CATEGORIA POR ID
const obtenerCategoria = async (req = request, res = response) => {
  const query = { estado: true };
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.json({ categoria });
};

//* CREAR CATEGORIA
const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La Categoria ${categoriaDB.nombre}, ya existe`,
    });
  }
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);
  await categoria.save();

  res.status(201).json({
    categoria,
  });
};

//* EDITAR CATEGORIA
const editarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id
  const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

  res.json({ categoria });
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  editarCategoria,
};
