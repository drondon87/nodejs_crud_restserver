const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('colors');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/socket.controller');

class Server {

    constructor() {
        this.app = express();
        this.puerto = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);


        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        }

        // Conectar a Base de Datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        // Rutas de la Aplicación
        this.routes();

        // Sockets
        this.sockets();
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

        // FileUpload - Carga de Archivo
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.usuarios, require('../routes/user.routes'));
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
        this.app.use(this.paths.productos, require('../routes/producto.routes'));
        this.app.use(this.paths.buscar, require('../routes/buscar.route'));
        this.app.use(this.paths.uploads, require('../routes/upload.route'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.puerto, () => {
            console.log('[RestServerApp] Servidor Ejecutandose en el Puerto: '.green + this.puerto.green);
        })
    }
}

module.exports = Server;