const validarCampos  = require("../middlewares/validar-campos");
const  validarJWT  = require("../middlewares/validad-jwt");
const validaRoles = require("../middlewares/validar-roles");
const validarArchivosSubir = require("../middlewares/validar-archivos");

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivosSubir
}