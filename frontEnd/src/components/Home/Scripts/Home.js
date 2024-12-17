import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imagenplaya from '../../../img/imagenplaya.avif';
import imagenmonta from '../../../img/imagenmonta.jpeg';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/BookingSearch.css';
//import '../../../Styles/tarjetas.css';
import '../Styles/Home.css';
//import '../Styles/financiacion.css';
import BookingSearch from './BookingSearch.js';
import Financiacion from '../Scripts/financiacion.js';


function Pagina() {
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDepartureDate(today);
    setReturnDate(today);
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchData = {
      origin: "Buenos Aires",
      destination: selectedOption,
      departureDate,
      returnDate,
      flights: [
        { destination: "Iguazú", price: 1000, image: imagenplaya },
        { destination: "Mendoza", price: 1200, image: imagenmonta }
      ]
    };
    navigate('/resultados', { state: { searchData } });
  };

  return (
    <>
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
          <img style={{ maxHeight: "80vh", objectFit: "cover" }} className="d-block w-100" src={imagenplaya} alt="Primera imagen" />
          <Carousel.Caption>
            <h3>Explora las mejores playas</h3>
            <p>Encuentra ofertas y destinos espectaculares.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img style={{ maxHeight: "80vh", objectFit: "cover" }} className="d-block w-100" src={imagenmonta} alt="Segunda imagen" />
          <Carousel.Caption>
            <h3>Aventuras en la montaña</h3>
            <p>Descubre rutas y destinos llenos de naturaleza.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <BookingSearch
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        handleSearchSubmit={handleSearchSubmit}
      />
      <Financiacion />
    </>
  );
}

export default Pagina;
