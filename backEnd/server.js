import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import vuelosRoutes from './routes/vuelosRoutes.js';

dotenv.config();

const app = express();

const URL_FRONT = process.env.URL_FRONT || 'http://localhost:3000';

const corsOptions = {
  origin: URL_FRONT,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`Ruta solicitada: ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);

app.use('/api/vuelos', vuelosRoutes);


mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch(err => {
  console.log('Error de conexión a MongoDB:', err);
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
