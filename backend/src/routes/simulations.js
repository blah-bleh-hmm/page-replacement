import { Router } from 'express';
import {
  getHistory,
  listAlgorithms,
  runSimulation,
} from '../controllers/simulationController.js';
import { validateSimulationInput } from '../middleware/validation.js';

const router = Router();

router.get('/algorithms', listAlgorithms);
router.post('/run', validateSimulationInput, runSimulation);
router.get('/history', getHistory);

export default router;
