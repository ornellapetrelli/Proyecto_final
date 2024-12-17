import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Login.css';


function Login({ setIsAuthenticated }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.includes('@')) {
      newErrors.email = 'Ingrese un email válido';
    }
    if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.ok) {
          localStorage.setItem('authToken', data.token);
          setIsAuthenticated(true); 
          navigate('/'); 
        } else {
          setErrors({ general: data.message || 'Error desconocido' });
        }
      } catch (error) {
        setErrors({ general: 'Error al iniciar sesión. Verifique sus credenciales.' });
      }
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-form">
        <Form onSubmit={handleSubmit}>
          <h1 className="text-center mb-4">Iniciar sesión</h1>
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
            Iniciar sesión
          </Button>

          <div className="text-center">
            <p>¿No tienes una cuenta? <Link to="/usuarios/signup">Regístrate aquí</Link></p>
            <p>¿Olvidaste tu contraseña? <Link to="/usuarios/olvidar">Recupérala aquí</Link></p>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
