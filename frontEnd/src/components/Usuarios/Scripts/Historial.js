import React from 'react';
import '../Styles/Historial.css';


const Historial = () => {
  const userFlights = JSON.parse(localStorage.getItem('userFlights')) || [];

  return (
    <div className="historial-page">
      <h1>Historial de Viajes</h1>
      {userFlights.length === 0 ? (
        <div className="no-flights-message">
          <p>En esta sección podrás tener un registro de aquellos viajes que fuiste teniendo.</p>
          <p>No tienes viajes registrados.</p>
        </div>
      ) : (
        <ul className="flights-list">
          {userFlights.map((flight, index) => (
            <li key={index} className="flight-item">
              <p><strong>Destino:</strong> {flight.destination}</p>
              <p><strong>Fecha:</strong> {flight.date}</p>
              <p><strong>Precio:</strong> ${flight.price}</p>
              <button className="btn-details">Ver detalles</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Historial;
