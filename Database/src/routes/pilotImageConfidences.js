const express = require('express');
const router = express.Router();
const confidenceController = require('../controllers/pilotImageConfidences');

router.post('/', confidenceController.createRecord);

module.exports = router;
