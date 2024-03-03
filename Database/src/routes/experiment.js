const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experiment');

router.post('/', experimentController.createRecord);
router.put('/', experimentController.updateRecord);

module.exports = router;
