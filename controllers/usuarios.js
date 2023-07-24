const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req, res = response) => {
  const query = {estado: true}

  const { limite, desde = 0 } = req.query;

  // const usuarios = await Usuario.find(query)
  //   .skip(Number(desde))
  //   .limit(Number(limite));
  //   const total = await Usuario.countDocuments(query)
    
    const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
    .skip(Number(desde))
    .limit(Number(limite))
  ])

  res.json({usuarios, total});
};

//* CREAR USUARIO
const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  console.log("EL ROL", rol);
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar contraseña
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  await usuario.save();

  res.json({
    msg: 'Usuario creado con éxito',
    usuario,
  });
};

//* EDITAR USUARIO
const usuariosPut = async (req, res = response) => {
  const { id } = req.params;

  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    //* Encriptar contraseña
    const salt = bcryptjs.genSaltSync(10);
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    msg: "Registro actualizado con éxito",
    usuario,
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  //* BORRADO FISICO
  // const usuario = await Usuario.findByIdAndDelete(id)
  //* BORRADO VIRTUAL RECOMENDADO
  const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
  const usuarioAutenticado = req.usuario
  res.json({
    msg: 'Usuario borrado con éxito',
    usuario,
    usuarioAutenticado
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
