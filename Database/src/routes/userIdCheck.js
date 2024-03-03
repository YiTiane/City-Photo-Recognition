const express = require('express');
const router = express.Router();
const userIdCheckController = require('../controllers/userIdCheck');

router.post('/', userIdCheckController.checkUserId);

module.exports = router;
