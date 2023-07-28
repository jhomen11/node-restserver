const { Categoria, Producto } = require("../models");
const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRolValido = async (rol = "") => {
  console.log("ROLEEEE", rol);
  const existeRol = await Role.findOne({ role: rol }).exec();
  if (!existeRol) {
    console.log("NO ESTA");
    throw new Error(`El rol ${rol} no existe en la BD`);
  }
};

const existeEmail = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya esta registrado`);
  }
};
const existeUsuarioPorId = async (id = "") => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe en la BD.`);
  }
};
const existeCategoriaId = async (id = "") => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`La categoria no existe en la BD.`);
  }
};
const existeProductoId = async (id = "") => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El producto no existe en la BD.`);
  }
};

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  const incluida = colecciones.includes(coleccion)
  if(!incluida){
    throw new Error(`La colección ${coleccion} no existe`)
  }
  return true
}


module.exports = {
  esRolValido,
  existeEmail,
  existeUsuarioPorId,
  existeCategoriaId,
  existeProductoId,
  coleccionesPermitidas
};
