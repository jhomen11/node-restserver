const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const {
  esRolValido,
  existeEmail,
  existeUsuarioPorId,
} = require("../helpers/db-validators");
const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", usuariosGet);
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check(
      "password",
      "El password es obligatorio y debe tener mínimo 6 caracteres"
    ).isLength({ min: 6 }),
    check("correo", "El correo ingresado no es válido").isEmail(),
    check("correo").custom(existeEmail),
    // check("rol", "No es un rol válido").isIn(['ADMIN_ROLE', 'USER_ROLE'])
    check("rol").custom(esRolValido),
  ],
  validarCampos,
  usuariosPost
);
router.put(
  "/:id",
  [
    check("id", "No es un Id válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRolValido),
  ],
  validarCampos,
  usuariosPut
);
router.delete(
  "/:id",
  [
    check("id", "No es un Id válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
  ],
  validarCampos,
  usuariosDelete
);
module.exports = router;
