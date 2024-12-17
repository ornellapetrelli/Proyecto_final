import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/Restablecer.css';



function ResetPassword() {
  const { resetToken } = useParams(); 
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      return; 
    } else {
      setPasswordError('');
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }), 
      });
      console.log('Token en la URL:', resetToken);

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Contraseña restablecida con éxito.');
        setTimeout(() => navigate('/usuarios/login'), 3000); 
      } else {
        setErrorMessage(data.message || 'Hubo un problema al restablecer la contraseña.');
      }
    } catch (error) {
      setErrorMessage('Error al enviar la solicitud. Inténtelo de nuevo más tarde.');
      console.error('Error:', error);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="reset-password-form">
        <Form onSubmit={handleSubmit}>
          <h1 className="text-center mb-4">Restablecer Contraseña</h1>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {passwordError && <Alert variant="danger">{passwordError}</Alert>} {/* Mostrar error de longitud */}
          <Form.Group controlId="formNewPassword" className="mb-3">
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresar nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mb-3">
            Restablecer Contraseña
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default ResetPassword;
