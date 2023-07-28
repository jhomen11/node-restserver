const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const path = require('path')
const fs = require('fs')

const cargarArchivo = async (req = request, res = response) => {

  try {
    // const nombre = await subirArchivo(req.files);
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({
      nombre,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con este id ${id}`,
        });
      }
      break;
    case "productos":
        modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con este id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Comuniquese con el administrador",
      });
  }

  //* LIMPIAR IMAGENES PREVIAS
  if(modelo.img){
    //* BORRAR LA IMAGEN DEL SERVIDOR
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen)
    }
  }
  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre
  await modelo.save()

  res.json(modelo);
};

const mostarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con este id ${id}`,
        });
      }
      break;
    case "productos":
        modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con este id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Comuniquese con el administrador",
      });
  }

  if(modelo.img){
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
    if(fs.existsSync(pathImagen)){
       return res.sendFile( pathImagen)
    }
  }

  const pathNoImagen = path.join(__dirname, '../assets', 'no-image.jpg');
  res.sendFile(pathNoImagen)
}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostarImagen
};
