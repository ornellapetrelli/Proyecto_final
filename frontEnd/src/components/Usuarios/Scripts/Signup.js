import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name) {
      newErrors.name = 'El nombre es obligatorio';
    }
    if (!email.includes('@')) {
      newErrors.email = 'Ingrese un email válido';
    }
    if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        console.log('Enviando datos:', { name, email, password });
        console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
           
        console.log('Backend Port:', process.env.REACT_APP_BACKEND_PORT); 
        console.log('Respuesta del servidor:', response);
        const data = await response.json();
        if (response.ok) {
          console.log('Registro exitoso:', data);
          navigate('/usuarios/login'); 
        } else {
          console.error('Error en el registro:', data);
          setErrors({ general: data.payload.detail });
        }
      } catch (error) {
        console.error('Error al registrar:', error);
        setErrors({ general: 'Error al registrar. Intente nuevamente.' });
      }
    }
  };
  

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="signup-form">
        <Form onSubmit={handleSubmit}>
          <h1 className="text-center mb-4">Registrarse</h1>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!errors.name}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresar Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          {errors.general && <div className="error-message">{errors.general}</div>}
          <Button variant="primary" type="submit" className="w-100 mb-3">
            Registrarse
          </Button>
          <div className="text-center">
            <p>¿Ya tienes una cuenta? <Link to="/usuarios/login">Iniciar sesión</Link></p>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Signup;
