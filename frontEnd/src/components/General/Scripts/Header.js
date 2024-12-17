import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Header.css';

function Header({ isAuthenticated, setIsAuthenticated }) { 
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".navbar");
      if (window.scrollY > 50) {
        header.style.backgroundColor = "#00aaff"; 
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false); 
    navigate('/');
  };

  return (
    <Navbar expand="lg" sticky="top" variant="dark" className="navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">Aerolineas.com</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav>
          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/usuarios/login">Iniciar sesión</Nav.Link>
                <Nav.Link as={Link} to="/usuarios/signup">Regístrate</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/usuarios/historial">Historial</Nav.Link>
                <Nav.Link onClick={handleLogout}>Salir</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
