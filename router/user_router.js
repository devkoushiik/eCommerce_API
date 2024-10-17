const express = require('express');
const router = express.Router();
const {getAllUsers, showCurrentUser, updateUser, updateUserPassword, getSingleUser} = require('../controller/user_controller');
const { authenticationUser, authenticationAdmin } = require('../middleware/authentication');

// Single route for user
router.route('/').get([authenticationUser,authenticationAdmin('admin')],getAllUsers);

router.route('/showMe').get(authenticationUser,showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(authenticationUser,updateUserPassword);

router.route('/:id').get(authenticationUser,getSingleUser);


module.exports = router;
