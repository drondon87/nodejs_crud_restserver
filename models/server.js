const express = require('express')
const cors = require('cors');
require('colors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.puerto = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        // Conectar a Base de Datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        // Rutas de la Aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //Cors
        this.app.use(cors())

        // Lectura y parseo de código
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.usuariosPath, require('../routes/user.routes'));
    }

    listen() {
        this.app.listen(this.puerto, () => {
            console.log('[RestServerApp] Servidor Ejecutandose en el Puerto: '.green + this.puerto.green);
        })
    }
}

module.exports = Server;