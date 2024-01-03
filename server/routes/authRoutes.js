const router = require('express').Router();

const { authData } = require("../controllers/authController");

router.get('/authData', authData)

module.exports = router;