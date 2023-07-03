const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = (req, res = response) => {
  res.json({
    msg: "get API - controlador",
  });
};

//* CREAR USUARIO
const usuariosPost = async (req, res = response) => {

  const { nombre, correo, password, rol } = req.body;
  console.log('EL ROL',rol);
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar contraseña
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  await usuario.save();

  res.json({
    usuario,
  });
};

//* EDITAR USUARIO
const usuariosPut = async (req, res = response) => {

  const { id } = req.params;

  const { _id, password, google, correo, ...resto} = req.body

  //* Encriptar contraseña
  const salt = bcryptjs.genSaltSync(10);
  resto.password = bcryptjs.hashSync(password, salt);
  
  const usuario = await Usuario.findByIdAndUpdate(id, resto)

  res.json({
    msg: "Registro actualizado con éxito",
    usuario,
  });
};


const usuariosDelete = (req, res = response) => {
  res.json({
    msg: "delete API - controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
