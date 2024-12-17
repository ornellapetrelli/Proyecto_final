import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Alert, Form } from 'react-bootstrap';
import './resultadosBusqueda.css';

const FlightSelection = () => {
  const location = useLocation();
  const { searchData } = location.state || { searchData: {} };

  const [cart, setCart] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [flights, setFlights] = useState([]);
  const [noFlightsMessage, setNoFlightsMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // en teoria deberia andar, pero no anda y no se xq
        // console.log('Parametros enviados al backend:', searchData);

        /*
        const response = await fetch(
          `http://localhost:5001/api/vuelos/flights?origin=${encodeURIComponent(searchData.origin)}&destination=${encodeURIComponent(searchData.destination)}&departureDate=${encodeURIComponent(searchData.departureDate)}&returnDate=${encodeURIComponent(searchData.returnDate)}`
        );
  
        // console.log('Estado HTTP de la respuesta:', response.status);
  
        if (!response.ok) {
          throw new Error(`Error en la obtencion de vuelos: ${response.statusText}`);
        }
  
        
        const data = await response.json();
  
        if (data.length === 0) {
          setNoFlightsMessage('No se encontraron vuelos disponibles para esta búsqueda.');
        } else {
          setFlights(data);
          setNoFlightsMessage('');
        }
        */
    const fetchFlights = async () => {
      try {
        const defaultFlights = [
          {
            lugarPartida: 'Ezeiza (Buenos Aires)',
            lugarDestino: 'Cataratas del Iguazú (Misiones)',
            precio: 1200,
            horario: '14:00',
            fechaVuelo: '2024-12-20',
          },
          {
            lugarPartida: 'Gobernador Castello (Viedma)',
            lugarDestino: 'El Calafate (Santa Cruz)',
            precio: 1500,
            horario: '18:00',
            fechaVuelo: '2024-12-21',
          },
        ];

        setFlights(defaultFlights);
      } catch (error) {
        console.error('Error al obtener vuelos:', error);
        setNoFlightsMessage('Hubo un error al obtener los vuelos. Intenta más tarde.');
      }
    };

    fetchFlights();
  }, [searchData]);

  const handleSelectFlight = (flight) => {
    const updatedCart = [...cart, { ...flight, passengers: 1 }];
    setCart(updatedCart);
  };

  const handleEditSearch = () => {
    navigate('/', { state: { searchData } });
  };

  const handleRemoveFlight = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const handlePassengerChange = (index, value) => {
    const updatedCart = cart.map((flight, i) => {
      if (i === index) {
        return { ...flight, passengers: value };
      }
      return flight;
    });
    setCart(updatedCart);
  };

  const handlePayment = () => {
    const authToken = localStorage.getItem('authToken'); 

    if (!authToken) {
      navigate('/Usuarios/login');
    } else {
      setAlertMessage(`El recibo será enviado a su correo electrónico registrado.`);
      //no llegue a terminar 
    }
  };

  return (
    <>
      <Container className="flight-selection-container">
        <h1 className="text-center mt-5 pt-5">Selecciona tu Vuelo</h1>
        <div className="search-details mb-4">
          <p><strong>Origen:</strong> {searchData.origin}</p>
          <p><strong>Destino:</strong> {searchData.destination}</p>
          <p><strong>Fecha de Ida:</strong> {searchData.departureDate}</p>
          <p><strong>Fecha de Vuelta:</strong> {searchData.returnDate}</p>
          <Button variant="secondary" className="edit-button" onClick={handleEditSearch}>
            Editar
          </Button>
        </div>

        {noFlightsMessage && (
          <Alert variant="warning" className="text-center mt-4">
            {noFlightsMessage}
          </Alert>
        )}

        {flights.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover className="table-sm">
              <thead>
                <tr>
                  <th>Lugar de Partida</th>
                  <th>Lugar de Llegada</th>
                  <th>Precio</th>
                  <th>Horario</th>
                  <th>Fecha</th>
                  <th>Seleccionar</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, index) => (
                  <tr key={index}>
                    <td>{flight.lugarPartida}</td>
                    <td>{flight.lugarDestino}</td>
                    <td>${flight.precio}</td>
                    <td>{flight.horario}</td>
                    <td>{flight.fechaVuelo ? new Date(flight.fechaVuelo).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <Button onClick={() => handleSelectFlight(flight)} variant="primary">Seleccionar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {cart.length > 0 && (
          <>
            <h2 className="text-center mt-4">Vuelos Seleccionados</h2>
            <div className="table-responsive">
              <Table striped bordered hover className="table-sm">
                <thead>
                  <tr>
                    <th>Lugar de Partida</th>
                    <th>Lugar de Llegada</th>
                    <th>Precio</th>
                    <th>Pasajeros</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((flight, index) => (
                    <tr key={index}>
                      <td>{flight.lugarPartida}</td>
                      <td>{flight.lugarDestino}</td>
                      <td>${flight.precio}</td>
                      <td>
                        <Form.Control
                          type="number"
                          value={flight.passengers}
                          min="1"
                          onChange={(e) => handlePassengerChange(index, e.target.value)}
                        />
                      </td>
                      <td>
                        <Button variant="danger" onClick={() => handleRemoveFlight(index)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="payment-section text-center mt-4">
              <Button variant="success" onClick={handlePayment}>
                Pagar
              </Button>
            </div>
          </>
        )}

        {alertMessage && (
          <Alert variant="success" className="mt-4">
            {alertMessage}
          </Alert>
        )}
      </Container>
    </>
  );
};

export default FlightSelection;
