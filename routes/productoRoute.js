const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos, validarJWT, esAdminRol } = require("../middlewares");
const { obtenerProductos, crearProducto, obtenerProducto, borrarProducto, editarProducto } = require("../controllers/productosController");
const { existeCategoriaId, existeProductoId } = require("../helpers/db-validators");


const router = Router();

//* OBTENER PRODUCTOS - PUBLICO
router.get("/", obtenerProductos);

//* OBTENER CATEGORIA POR ID - PUBLICO
router.get(
    "/:id",
    [
      check("id", "No es un id válido").isMongoId(),
      check("id").custom(existeProductoId),
      validarCampos,
    ],
    obtenerProducto
  );

//*CREAR PRODUCTO - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VÁLIDO
router.post(
    "/",
    [
        validarJWT,
        check("nombre", "El campo es obligatorio").not().isEmpty(),
        check("categoria", "No es un id válido").isMongoId(),
        check("categoria").custom(existeCategoriaId),
        validarCampos,
    ],
    crearProducto
    );

    //* EDITAR PRODUCTO - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VÁLIDO
router.put(
    "/:id",
    [
      validarJWT,
      check("id", "No es un id válido").isMongoId(),
      check("id").custom(existeProductoId),
      validarCampos,
    ],
    editarProducto
  );
  //* ELIMINAR PRODUCTO - PRIVADO - ADMINISTRADOR
  router.delete(
    "/:id",
    [
      validarJWT,
      esAdminRol,
      check("id", "No es un id válido").isMongoId(),
      check("id").custom(existeProductoId),
      validarCampos,
    ],
    borrarProducto
  );
  
  module.exports = router;
