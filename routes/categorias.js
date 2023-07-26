const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT, validarCampos } = require("../middlewares");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  editarCategoria,
} = require("../controllers/categorias");
const { existeCategoriaId } = require("../helpers/db-validators");

const router = Router();

//* OBTENER CATEGORIAS - PUBLICO
router.get("/", obtenerCategorias);

//* OBTENER CATEGORIA POR ID - PUBLICO
router.get(
  "/:id",
  [
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(existeCategoriaId),
    validarCampos,
  ],
  obtenerCategoria
);

//*CREAR CATEGORIA - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VÁLIDO
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El campo es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);
//* EDITAR CATEGORIA - PRIVADO- CUALQUIER PERSONA CON UN TOKEN VÁLIDO
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El campo es obligatorio").not().isEmpty(),
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(existeCategoriaId),
    validarCampos,
  ],
  editarCategoria
);
//* ELIMINAR CATEGORIA - PRIVADO - ADMINISTRADOR
router.delete("/:id", (req, resp) => {
  resp.json("DELETE");
});

module.exports = router;
