const path = require('path');
const express = require('express');
const router = express.Router();
const page = require('../controllers/pages');
const { createUser, deleteUser, verifyAdminExistence, updateUser } = require('../controllers/users');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', verifyAdminExistence, page.mainPage); 

router.get('/signup', page.signupPage);
router.post('/register', createUser);

router.get('/remove', page.deletePage);
router.post('/removed', deleteUser);

router.get('/userUpdate', page.userUpdatePage);
router.post('/userUpdated', updateUser);
module.exports = router;
