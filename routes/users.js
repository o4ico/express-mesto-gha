const router = require('express').Router();
const User = require('../models/user');
const { getUser, createUser, getUserInfo } = require('../controllers/users');

router.get('/users', getUser);
router.post('/users', createUser);
router.post('/users/:userId', getUserInfo);

module.exports = router;