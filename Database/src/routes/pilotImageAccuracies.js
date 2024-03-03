const express = require('express');
const router = express.Router();
const accuracyController = require('../controllers/pilotImageAccuracies');

router.post('/', accuracyController.createRecord);
router.put('/', accuracyController.updateRecord);

module.exports = router;
