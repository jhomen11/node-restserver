const { v4: uuidv4 } = require("uuid");
const path = require("path");

const subirArchivo = (files, extensionesValidas = ["pdf", "jpg", 'jpeg', 'png'],carpeta = "") => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const archivoCortado = archivo.name.split(".");
    const extArchivo = archivoCortado[archivoCortado.length - 1];

    //* VALIDAR EXT
    if (!extensionesValidas.includes(extArchivo)) {
      return reject(`La extension ${extArchivo} no esta permitida`);
    }

    const nombreTemp = uuidv4() + "." + extArchivo;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

module.exports = {
  subirArchivo,
};
