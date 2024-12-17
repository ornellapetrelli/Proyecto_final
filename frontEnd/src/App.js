import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Pagina from './components/Home/Scripts/Home.js';
import Login from './components/Usuarios/Scripts/Login.js';
import Signup from './components/Usuarios/Scripts/Signup.js';
import Footer from './components/General/Scripts/footer.js';
import Header from './components/General/Scripts/Header.js';
import Results from './components/resultadosBusqueda';
import ForgotPassword from './components/Usuarios/Scripts/Olvidar.js'; 
import ResetPassword from './components/Usuarios/Scripts/Restablecer.js'; 
import Historial from './components/Usuarios/Scripts/Historial.js';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token); 
  }, []); 

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} /> 
      <ScrollToTop />
      <div className="App">

        <Routes>
          <Route path="/" element={<Pagina />} />
          <Route path="/usuarios/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/usuarios/signup" element={<Signup />} />
          <Route path="/resultados" element={<Results />} />
          <Route path="/usuarios/olvidar" element={<ForgotPassword />} />
          <Route path="/usuarios/restablecer/:resetToken" element={<ResetPassword />} />
          <Route path="/usuarios/historial" element={isAuthenticated ? <Historial /> : <Login />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
