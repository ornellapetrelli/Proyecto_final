// import React from 'react';
// import { Container,Button } from 'react-bootstrap';
// import './tarjetas.css';

// //al final no las uso pero me costo asi que las dejo aqui
// const Tarjetas = ({ flights, handleSelectFlight }) => {
//   return (
//     <Container>
//       <div className="total-card">
//         <div className="card-container">
//           {flights.map((flight, index) => (
//             <div className="card" key={index}>
//               <img src={flight.image} alt={flight.destination} />
//               <div className="info">
//                 <h1>{flight.destination}</h1>
//                 <p>Precio: ${flight.price}</p>
//                 <Button onClick={() => handleSelectFlight(flight)} variant="primary">
//                   Seleccionar
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default Tarjetas;
