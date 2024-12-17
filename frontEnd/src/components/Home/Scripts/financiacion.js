import React from 'react';
import bbva from '../../../img/financiacion/bbva.jpeg';
import macro from '../../../img/financiacion/macro.png';
import galicia from '../../../img/financiacion/galicia.png';
import santander from '../../../img/financiacion/santander.png';
import '../Styles/financiacion.css';


const Financiacion = () => {
  return (
    <div className="financiacion-container">
      <h2 className="financiacion-title">Financiación</h2>
      <div className="financiacion">
        <img src={macro} alt="Macro" className="financiacion-img" />
        <img src={bbva} alt="BBVA" className="financiacion-img" />
        <img src={galicia} alt="Galicia" className="financiacion-img" />
        <img src={santander} alt="Santander" className="financiacion-img" />
      </div>
    </div>
  );
};

export default Financiacion;
