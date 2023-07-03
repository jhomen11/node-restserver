
const Role = require('../models/role')
const Usuario = require("../models/usuario");

const esRolVaido = async(rol = "") => {
    console.log('ROLEEEE', rol);
   const existeRol = await Role.findOne({role: rol}).exec()
    if(!existeRol) {
      console.log('NO ESTA');
      throw new Error(`El rol ${rol} no existe en la BD`)
    }
  
  }

  const existeEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
  if( existeEmail) {
    throw new Error( `El correo ${correo} ya esta registrado`)
  }
  }

  module.exports = {
    esRolVaido,
    existeEmail
  }