import mongoose from 'mongoose';
import ENVIROMENT from '../config/enviroment.config.js'; 

mongoose.connect(ENVIROMENT.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión exitosa a la base de datos MongoDB');
    })
    .catch((error) => {
        console.error('Error al conectar con la base de datos MongoDB:', error);
    });
