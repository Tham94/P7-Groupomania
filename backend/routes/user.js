const express = require('express');
const userCtrl = require('../controllers/user');
const passwordValidator = require('../middlewares/password-validator');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const router = express.Router();

router.get('/users', auth, userCtrl.getUsers);
router.get('/users/user', auth, userCtrl.getOneUser);
router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/users/:id/name', auth, userCtrl.updateUserName);
router.put('/users/:id/lastname', auth, userCtrl.updateUserLastName);
router.put('/users/:id/image', auth, multer, userCtrl.updateProfilePic);
router.put('/users/:id/image/delete', auth, multer, userCtrl.deleteProfilePic);
router.delete('/users/:id', auth, userCtrl.deleteUser);
module.exports = router;
