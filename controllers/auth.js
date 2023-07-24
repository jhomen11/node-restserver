const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-JWT");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {

    //* VERIFICAR SI EL EMAIL EXISTE
    const usuario = await Usuario.findOne({correo})
    if(!usuario){
        return res.status(400).json({
            mgs: "Usuario / Password no son correctos"
        })
    }
    //* VERIFICAR SI EL USUARIO ESTA ACTIVO
    if(!usuario.estado){
        return res.status(400).json({
            mgs: "Usuario / Password no son correctos"
        })
    }
    //* VERIFICAR LA CONTRASEÑA
    const validPassword = bcryptjs.compareSync(password, usuario.password)
    if(!validPassword){
        return res.status(400).json({
            mgs: "Usuario / Password no son correctos"
        })
    }

    //* GENERAR EL JWT
    const token = await generarJWT(usuario.id)


    res.json({
      usuario,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Algo salio mal, hable con el administrador",
    });
  }
};

module.exports = {
  login,
};
