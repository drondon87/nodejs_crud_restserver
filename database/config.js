const mongoose = require('mongoose');
require('colors');

const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('[RestServerApp] Base de Datos Online'.green);


    } catch (error) {
        console.error(error);
        throw new Error('[RestServerApp] Error a la hora de iniciar la base de datos'.red);
    }
}

module.exports = {
    dbConnection
}