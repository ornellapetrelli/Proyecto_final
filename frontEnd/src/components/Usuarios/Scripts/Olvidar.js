import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../Styles/Olvidar.css';


function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email.includes('@')) {
      newErrors.email = 'Ingrese un email válido';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.ok) {
          setSuccessMessage('Un enlace de recuperación de contraseña ha sido enviado a su correo.');
        } else {
          setErrorMessage(data.message || 'Hubo un problema al enviar el correo.');
        }
        setEmail('');
      } catch (error) {
        setErrorMessage('Error al enviar la solicitud. Inténtelo de nuevo más tarde.');
        console.error('Error:', error);
      }
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="password-reset-form">
        <Form onSubmit={handleSubmit}>
          <h1 className="text-center mb-4">Recuperar Contraseña</h1>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
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
          <Button variant="primary" type="submit" className="w-100 mb-3">
            Enviar
          </Button>
          <div className="text-center">
            <p>¿Volver a <Link to="/usuarios/login">Iniciar sesión</Link>?</p>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default ForgotPassword;