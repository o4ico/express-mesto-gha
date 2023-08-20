const router = require('express').Router();
const User = require('../models/user');
const { getUserById, getUsers, patchUserInfo, patchUserAvatar, getCurrentUserInfo } = require('../controllers/users');
const { userIdValidation, userInfoEditValidation, userAvatarEditValidation } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/:userId', userIdValidation, getUserById);
router.patch('/me', userInfoEditValidation, patchUserInfo);
router.patch('/me/avatar', userAvatarEditValidation, patchUserAvatar);
router.get('/me', getCurrentUserInfo);

module.exports = router;