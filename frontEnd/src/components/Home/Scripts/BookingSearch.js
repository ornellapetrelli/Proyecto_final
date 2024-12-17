import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import '../Styles/BookingSearch.css';


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
  { code: 'VDM', name: 'Gobernador Castello (Viedma)' }
];

function BookingSearch() {
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDepartureDate(today);
    setReturnDate(today);
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (departureDate && departureDate < today) newErrors.departureDate = 'La fecha de ida no puede ser anterior al día de hoy';
    if (returnDate && returnDate < today) newErrors.returnDate = 'La fecha de vuelta no puede ser anterior al día de hoy';
    if (origin && destination && origin === destination) newErrors.destination = 'El origen y el destino no pueden ser iguales';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:5001/api/vuelos/generate-random-flights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al generar los vuelos');
        }
        const searchData = {
          origin,
          destination,
          departureDate,
          returnDate,
          flights: [
            { destination: "Iguazú", price: 1000, image: 'ruta/a/imagen.jpg' },
            { destination: "Mendoza", price: 1200, image: 'ruta/a/imagen.jpg' }
          ]
        };
        navigate('/resultados', { state: { searchData } });
      } catch (error) {
        console.error('Error al generar vuelos:', error);
      }
    }
  };

  return (
    <div className='serch-box'>
      <h2 className="check-in-title">Elegí tu vuelo</h2>
      <div className="booking-search">
        <form className="search-form1" onSubmit={handleSearchSubmit}>
          <div className="destination-inputs">
            <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="input-select">
              <option value="">Seleccionar origen</option>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.name}>{airport.name}</option>
              ))}
            </select>
            {errors.origin && <div className="error">{errors.origin}</div>}
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="input-select">
              <option value="">Seleccionar destino</option>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.name}>{airport.name}</option>
              ))}
            </select>
            {errors.destination && <div className="error">{errors.destination}</div>}
          </div>
          <div className="date-inputs">
            <div className="input-group">
              <label htmlFor="departureDate" className="input-label">Fecha de ida</label>
              <input 
                type="date" 
                id="departureDate" 
                className="input-date" 
                value={departureDate} 
                onChange={(e) => setDepartureDate(e.target.value)} 
              />
            </div>
            {errors.departureDate && <div className="error">{errors.departureDate}</div>}

            <div className="input-group">
              <label htmlFor="returnDate" className="input-label">Fecha de vuelta</label>
              <input 
                type="date" 
                id="returnDate" 
                className="input-date" 
                value={returnDate} 
                onChange={(e) => setReturnDate(e.target.value)} 
              />
            </div>
            {errors.returnDate && <div className="error">{errors.returnDate}</div>}
          </div>
          <button className="search-button" type="submit">BUSCAR</button>
        </form>
      </div>
    </div>
  );
}

export default BookingSearch;
