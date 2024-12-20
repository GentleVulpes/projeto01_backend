const path = require('path');
const express = require('express');
const router = express.Router();
const { createUser, signIn, deleteUser, verifyAdminExistence, updateUser, userLogin } = require('../controllers/users');
const { createCharacter } = require('../controllers/characters');
const { createItem } = require('../controllers/itens');
const { createToken } = require('../controllers/utils');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/install', verifyAdminExistence);
router.post('/admin/register/:name/:email/:password', createUser(true));
router.delete('/admin/delete/:id/:name/:email/:password', deleteUser);
router.put('/admin/update/:id/:name/:email/:password', updateUser);

//USERS
router.get('/login/:name/:email/:password', signIn);
router.post('/register/:name/:email/:password', createUser(false));

// router.get('/login/:user', authenticateJson);


router.post('/register/user/:email/item/:name/:quantity', createItem);
router.post('/register/user/:email/character/:name/:level/:race', createCharacter);



// router.get('/registerAdmn');
// router.put('/updateUser', authenticateJson);
// router.put('/updateAdmin', authenticatJson);
// router.remove('/removeUser', authenticatJson);



module.exports = router;
