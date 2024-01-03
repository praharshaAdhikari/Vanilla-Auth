const { login, register, verify } = require('../controllers/nonAuthController');

const router = require('express').Router();

router.post('/login', login)
router.post('/register', register)
router.get('/verify/:user/:uniqueString', verify)

module.exports = router;