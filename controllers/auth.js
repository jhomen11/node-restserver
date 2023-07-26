const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-JWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    //* VERIFICAR SI EL EMAIL EXISTE
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        mgs: "Usuario / Password no son correctos",
      });
    }
    //* VERIFICAR SI EL USUARIO ESTA ACTIVO
    if (!usuario.estado) {
      return res.status(400).json({
        mgs: "Usuario / Password no son correctos",
      });
    }
    //* VERIFICAR LA CONTRASEÑA
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        mgs: "Usuario / Password no son correctos",
      });
    }

    //* GENERAR EL JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Algo salio mal, hable con el administrador",
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;
  try {
    const { name, picture, email } = await googleVerify(id_token);
    
    let usuario = await Usuario.findOne({correo: email})
    
    if(!usuario){
      //* CREAR EL USUSARIO
      const data = {
        nombre: name,
        correo: email,
        password: ':P',
        img: picture,
        google: true,
        rol: 'USER_ROLE'
      }
      usuario = new Usuario(data)
      await usuario.save()
    }
    if(!usuario.estado){
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado'
      })
    }

      //* GENERAR EL JWT
      const token = await generarJWT(usuario.id);

    res.json({
      msg: "Todo bien",
      token,
      usuario
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
