const express = require('express');
const router = express.Router();
const accuracyController = require('../controllers/pilotFinalAccuracies');

router.post('/', accuracyController.createRecord);

module.exports = router;
