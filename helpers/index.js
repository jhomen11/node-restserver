const dbValidators = require("./db-validators");
const subirArchivo = require("./subir-archivo");

module.exports = {
  ...dbValidators,
  ...subirArchivo,
};
