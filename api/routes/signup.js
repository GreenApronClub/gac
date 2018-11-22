const express = require('express');
const SignupController = require('../../controllers/signup.js');

const router = express.Router();
router.post('/', SignupController.register_user);

module.exports = router;
