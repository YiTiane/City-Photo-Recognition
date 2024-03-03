const express = require('express');
const router = express.Router();
const calibrationController = require('../controllers/calibration');

router.post('/', calibrationController.createRecord);
router.put('/', calibrationController.updateRecord);

module.exports = router;
