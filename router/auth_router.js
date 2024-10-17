const {loginController, registerController, logoutController} = require('../controller/auth_controller');

const router = require('express').Router();

router.route('/login').post(loginController);
router.route('/register').post(registerController);
router.route('/logout').post(logoutController);


module.exports = router;