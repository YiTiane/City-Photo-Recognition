const express = require('express');
const router = express.Router();
const calibration10Controller = require('../controllers/calibration_10_NoF');

router.post('/', calibration10Controller.createRecord);
router.put('/', calibration10Controller.updateRecord);

module.exports = router;
