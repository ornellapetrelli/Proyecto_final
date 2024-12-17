import express from 'express';
import { insertRandomFlights, getFlights} from '../controllers/vuelosController.js';

const router = express.Router();

router.post('/generate-random-flights', insertRandomFlights);

router.get('/flights', getFlights);
//router.post('/enviar-correo', VuelosController.handlePayment);
export default router;
