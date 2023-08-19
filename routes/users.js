const router = require('express').Router();
const User = require('../models/user');
const { getUserById, getUsers, patchUserInfo, patchUserAvatar, getCurrentUserInfo } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', patchUserInfo);
router.patch('/me/avatar', patchUserAvatar);
router.get('/me', getCurrentUserInfo);

module.exports = router;