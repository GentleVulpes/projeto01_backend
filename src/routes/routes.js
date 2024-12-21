const path = require('path');
const express = require('express');
const router = express.Router();
const { createUser, signIn, deleteUser, verifyAdminExistence, updateUser, userLogin } = require('../controllers/users');
const { createCharacter, updateCharacter, deleteCharacter } = require('../controllers/characters');
const { createItem, updateItem, deleteItem } = require('../controllers/itens');
const { createToken } = require('../controllers/utils');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

//ADMIN - INSTALL
router.get('/install', verifyAdminExistence);

//ADMIN - USER
router.post('/admin/user/register/:name/:email/:password', createUser(true));
router.put('/admin/user/update/:id/:name/:email/:password', updateUser);
router.delete('/admin/user/delete/:id/:name/:email/:password', deleteUser);

//ADMIN - ITEM
router.post('/admin/item/register/:name/:rarity/:email', createItem);
router.put('/admin/item/update/:name/:rarity/:email', updateItem);
router.delete('/admin/item/delete/:email', deleteItem);

//ADMIN - CHARACTER
router.post('/admin/character/register/:name/:level/:race/:email', createCharacter);
router.put('/admin/character/update/:name/:level/:race/:email', updateCharacter);
router.delete('/admin/character/delete/:email', deleteCharacter);



//USER
router.post('/user/login/:name/:email/:password', signIn);
router.post('/user/register/:name/:email/:password', createUser(false));
router.put ('/user/update/:name/:email/:password', updateUser);


//USER - CHARACTER
router.post('/register/user/:email/character/:name/:level/:race', createCharacter);



// router.get('/registerAdmn');
// router.put('/updateUser', authenticateJson);
// router.put('/updateAdmin', authenticatJson);
// router.remove('/removeUser', authenticatJson);



module.exports = router;
