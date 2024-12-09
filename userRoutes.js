const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController').default;
const router = express.Router();

router.route('/:id').get(getUserProfile).put(updateUserProfile);

module.exports = router;
