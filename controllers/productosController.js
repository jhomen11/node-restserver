const { response, request } = require("express");
const { Producto } = require("../models");

//* OBTENER PRODUCTOS
const obtenerProductos = async (req = request, res = response) => {
  const query = { estado: true };

  const { limite, desde = 0 } = req.query;

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({ productos, total });
};

//* OBTENER PRODUCTO POR ID
const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json({ producto });
};

//* CREAR PRODUCTO
const crearProducto = async (req = request, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDb = await Producto.findOne({ nombre: body.nombre });
  if (productoDb) {
    return res.status(400).json({
      msg: `El producto ${productoDb.nombre}, ya existe`,
    });
  }
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);
  await producto.save();

  res.status(201).json({
    producto,
  });
};

//* EDITAR PRODUCTO
const editarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json({ producto });
};

//* BORRAR PRODUCTO
const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  //* BORRADO VIRTUAL RECOMENDADO
  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    msg: "Producto borrado con éxito",
    productoBorrado,
  });
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  editarProducto,
  borrarProducto,
};
