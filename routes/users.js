const router = require('express').Router();
const User = require('../models/user');
const { createUser, getUserInfo, getUsers, patchUserInfo, patchUserAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserInfo);
router.patch('/me', patchUserInfo);
router.patch('/me/avatar', patchUserAvatar);

module.exports = router;