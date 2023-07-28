const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require('express-fileupload')

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.authPath = "/api/auth";
    this.usuariosPath = "/api/usuarios";
    this.categoriasPath = "/api/categorias";
    this.productosPath = "/api/productos";
    this.buscarPath = "/api/buscar";
    this.uploadsPath = "/api/uploads";

    //Conexión a base de datos
    this.conectarDB();

    // Middelewares
    this.middlewares();

    //Rutas de la app
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static("public"));

    //* CARGA DE ARCHIVOS
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true
      })
    );
  }

  routes() {
    this.app.use(this.authPath, require("../routes/auth"));
    this.app.use(this.usuariosPath, require("../routes/usuarios"));
    this.app.use(this.categoriasPath, require("../routes/categorias"));
    this.app.use(this.productosPath, require("../routes/productoRoute"));
    this.app.use(this.buscarPath, require("../routes/buscadorRoute"));
    this.app.use(this.uploadsPath, require("../routes/uploadsRoute"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server on port ${this.port}`);
    });
  }
}

module.exports = Server;
