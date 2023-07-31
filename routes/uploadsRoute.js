const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos, validarArchivosSubir } = require("../middlewares");
const {
  cargarArchivo,
  actualizarImagen,
  mostarImagen,
  actualizarImagenCluodinary,
} = require("../controllers/uploadsController");
const { coleccionesPermitidas } = require("../helpers");

const router = Router();

router.post("/", validarArchivosSubir, cargarArchivo);
router.put(
  "/:coleccion/:id",
  [
    check("id", "No es un id válido").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarArchivosSubir,
    validarCampos,
  ],
  actualizarImagenCluodinary
//   actualizarImagen
);
router.get(
  "/:coleccion/:id",
  [
    check("id", "No es un id válido").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],mostarImagen
  
);

module.exports = router;
