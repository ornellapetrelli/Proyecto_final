import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/footer.css';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/usuarios/signup');
  };

  return (
    <footer className="footer">
      <div className="footer-title">
        <h1>¿Necesitás ayuda con tu viaje?</h1>
        <p>Encontrá toda la información que necesitás en nuestro centro de ayuda</p>
      </div>

      <div className="footer-top">
        <div className="footer-section">
          <h3><Link to="/#">Políticas de equipaje</Link></h3>
          <ul>
            <li>Exceso de equipaje</li>
            <li>Equipaje adicional</li>
            <li>Artículos restringidos</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3><Link to="/#">Información para tu viaje</Link></h3>
          <ul>
            <li>Asistencias</li>
            <li>Niños y bebés</li>
            <li>Mascotas</li>
            <li>Experiencia de viaje</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3><Link to="/#">Preguntas frecuentes</Link></h3>
          <ul>
            <li>Check In</li>
            <li>Reservas y Servicios</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3><Link to="/#">Servicios e información importante</Link></h3>
          <ul>
            <li>Estado de vuelo</li>
            <li>Cambios online</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="subscribe">
          <p>Suscribite para recibir nuestras promociones</p>
          <button onClick={handleClick}>Suscribirme</button>
        </div>
      </div>

      <footer className="footer-bottom2">
        <p>&copy; 2024 Aerolineas.com</p>
      </footer>
    </footer>
  );
}

export default Footer;
