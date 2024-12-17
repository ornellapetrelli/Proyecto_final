import mongoose from 'mongoose';

const vueloSchema = new mongoose.Schema({
  fechaVuelo: Date,
  horario: String,
  codigoVuelo: String,
  lugarPartida: String,
  lugarDestino: String,
  precio: Number,
  duracion: String,
  escalas: Number,
  aerolinea: String,
  estadoVuelo: String,
  asientosDisponibles: Number,
  tipoAvion: String,
  claseServicio: String,
  baggageInfo: String,
  serviciosIncluidos: String
});

const Vuelo = mongoose.model('Vuelo', vueloSchema);

export default Vuelo;
