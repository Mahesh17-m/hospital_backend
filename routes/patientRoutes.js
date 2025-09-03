const express = require('express');
const {
  getPatients,
  registerPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  getTodayPatientCount 
} = require('../controllers/patientController');

const router = express.Router();

router.get('/', getPatients);

router.get('/today-count', getTodayPatientCount);

router.post('/register', registerPatient);

router.get('/:id', getPatientById);

router.put('/:id', updatePatient);

router.delete('/:id', deletePatient);

module.exports = router;