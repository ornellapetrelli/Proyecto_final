import Vuelo from '../models/vuelos.js';

const airports = [
  { code: 'EZE', name: 'Ezeiza (Buenos Aires)' },
  { code: 'AEP', name: 'Aeroparque (Buenos Aires)' },
  { code: 'COR', name: 'Pajas Blancas (Córdoba)' },
  { code: 'MDZ', name: 'El Plumerillo (Mendoza)' },
  { code: 'ROS', name: 'Islas Malvinas (Rosario)' },
  { code: 'IGR', name: 'Cataratas del Iguazú (Misiones)' },
  { code: 'BRC', name: 'San Carlos de Bariloche (Río Negro)' },
  { code: 'NQN', name: 'Presidente Perón (Neuquén)' },
  { code: 'REL', name: 'Almirante Zar (Trelew)' },
  { code: 'FTE', name: 'El Calafate (Santa Cruz)' },
  { code: 'SLA', name: 'Martín Miguel de Güemes (Salta)' },
  { code: 'JUJ', name: 'Gobernador Horacio Guzmán (Jujuy)' },
  { code: 'TUC', name: 'Benjamín Matienzo (Tucumán)' },
  { code: 'UAQ', name: 'Domingo Faustino Sarmiento (San Juan)' },
  { code: 'LUQ', name: 'Brigadier Mayor César Raúl Ojeda (San Luis)' },
  { code: 'RGL', name: 'Piloto Civil Norberto Fernández (Río Gallegos)' },
  { code: 'CRD', name: 'General Enrique Mosconi (Comodoro Rivadavia)' },
  { code: 'BHI', name: 'Comandante Espora (Bahía Blanca)' },
  { code: 'VDM', name: 'Gobernador Castello (Viedma)' },
];

function getRandomDate(monthRange = 4) {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + monthRange);
  const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());

  const randomDate = new Date(randomTimestamp);

  const year = randomDate.getFullYear();
  const month = (randomDate.getMonth() + 1).toString().padStart(2, '0'); 
  const day = randomDate.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`; 
  console.log('${year}${month}-${day}');
}



function generateRandomFlight() {
  const departureAirport = airports[Math.floor(Math.random() * airports.length)];
  let destinationAirport = airports[Math.floor(Math.random() * airports.length)];

  while (departureAirport.code === destinationAirport.code) {
    destinationAirport = airports[Math.floor(Math.random() * airports.length)];
  }
  const hours = Math.floor(Math.random() * 24); 
  const minutes = Math.floor(Math.random() * 60);
  const formattedHour = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return new Vuelo({
    fechaVuelo: getRandomDate(), 
    horario: formattedHour,  
    codigoVuelo: `FL${Math.floor(Math.random() * 9000) + 1000}`,
    lugarPartida: departureAirport.name,
    lugarDestino: destinationAirport.name,
    precio: Math.floor(Math.random() * 300) + 50,
    duracion: `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 60)}m`,
    escalas: Math.floor(Math.random() * 2),
    aerolinea: `Aerolíneas ${['X', 'Y', 'Z'][Math.floor(Math.random() * 3)]}`,
    estadoVuelo: ['A tiempo', 'Retrasado', 'Cancelado'][Math.floor(Math.random() * 3)],
    asientosDisponibles: Math.floor(Math.random() * 100) + 50,
    tipoAvion: ['Boeing 737', 'Airbus A320', 'Embraer E195'][Math.floor(Math.random() * 3)],
    claseServicio: ['Económica', 'Ejecutiva', 'Primera clase'][Math.floor(Math.random() * 3)],
    baggageInfo: '1 maleta de 20kg',
    serviciosIncluidos: ['Comida', 'Wi-Fi'][Math.floor(Math.random() * 2)],
  });
}


export async function insertRandomFlights(req, res) {
  try {
    const numVuelos = req.query.numVuelos || 5;
    const vuelos = [];
    
    for (let i = 0; i < numVuelos; i++) {
      vuelos.push(generateRandomFlight());  
    }

    await Vuelo.insertMany(vuelos);
    res.status(200).json({ message: `${numVuelos} vuelos aleatorios insertados con éxito.` });
  } catch (err) {
    console.error('Error al insertar vuelos:', err);
    res.status(500).json({ error: 'Error al insertar los vuelos. Intenta nuevamente.' });
  }
}


export const getFlights = async (req, res) => {
  console.log('Solicitud recibida en la ruta /api/vuelos/flights');
  console.log('Cuerpo de la solicitud:', req.body);

  const { origin, destination, departureDate, returnDate } = req.body; 

  if (!origin || !destination) {
    console.log('Faltan parámetros "origin" o "destination"');
    return res.status(400).json({ error: 'Los parámetros "origin" y "destination" son obligatorios.' });
  }

  const filters = {
    lugarPartida: origin,
    lugarDestino: destination,
  };

  try {
    if (departureDate) {
      const departure = new Date(departureDate);
      if (isNaN(departure)) {
        console.log('Formato de fecha de salida no válido:', departureDate);
        return res.status(400).json({ error: 'Formato de fecha de salida no válido.' });
      }
      filters.fechaVuelo = { ...filters.fechaVuelo, $gte: departure };
    }

    if (returnDate) {
      const returnD = new Date(returnDate);
      if (isNaN(returnD)) {
        console.log('Formato de fecha de regreso no válido:', returnDate);
        return res.status(400).json({ error: 'Formato de fecha de regreso no válido.' });
      }
      if (departureDate && returnD < new Date(departureDate)) {
        console.log('La fecha de regreso no puede ser anterior a la fecha de salida');
        return res.status(400).json({ error: 'La fecha de regreso no puede ser anterior a la fecha de salida.' });
      }
      filters.fechaVuelo = { ...filters.fechaVuelo, $lte: returnD };
    }

    console.log('Filtros usados:', filters);

    const flights = await Vuelo.find(filters);

    console.log('Vuelos encontrados:', flights);

    if (flights.length === 0) {
      console.log('No se encontraron vuelos con los filtros especificados.');
      return res.status(404).json({ message: 'No se encontraron vuelos con los filtros especificados.' });
    }

    res.status(200).json(flights);
  } catch (error) {
    console.error('Error al obtener vuelos:', error);
    res.status(500).json({ error: 'Hubo un error al procesar tu solicitud. Intenta más tarde.' });
  }
};
