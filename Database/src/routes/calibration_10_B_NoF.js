const express = require('express');
const router = express.Router();
const calibration10BController = require('../controllers/calibration_10_B_NoF');

router.post('/', calibration10BController.createRecord);
router.put('/', calibration10BController.updateRecord);

module.exports = router;
