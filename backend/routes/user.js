const express = require('express');
const userCtrl = require('../controllers/user');
const passwordValidator = require('../middlewares/password-validator');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/users', userCtrl.getUsers);
router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/users/:id', auth, userCtrl.deleteUser);
module.exports = router;
