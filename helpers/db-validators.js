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

module.exports = {
  esRolValido,
  existeEmail,
  existeUsuarioPorId
};
