const path = require('path');
const express = require('express');
const router = express.Router();
const { createUser, signIn, deleteUser, verifyAdminExistence, updateUser, userLogin } = require('../controllers/users');
const { createCharacter } = require('../controllers/characters');
const { createItem, updateItem, deleteItem } = require('../controllers/itens');
const { createToken } = require('../controllers/utils');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/install', verifyAdminExistence);

//ADMIN - USER
router.post('/admin/user/register/:name/:email/:password', createUser(true));
router.put('/admin/user/update/:id/:name/:email/:password', updateUser);
router.delete('/admin/user/delete/:id/:name/:email/:password', deleteUser);

//ADMIN - ITEM
// router.delete('/admin/delete/:id/:name/:quantity/:email', deleteItem);
router.post('/admin/item/register/:name/:rarity/:email', createItem);
router.put('/admin/item/update/:name/:rarity/:email', updateItem);
router.delete('/admin/item/delete/:email', deleteItem);


//USER
router.post('/login/:name/:email/:password', signIn);
router.post('/register/:name/:email/:password', createUser(false));

//USER - ITEM
router.post('/user/item/register/:email/:name/:rarity', createItem);

//USER - CHARACTER
router.post('/register/user/:email/character/:name/:level/:race', createCharacter);



// router.get('/registerAdmn');
// router.put('/updateUser', authenticateJson);
// router.put('/updateAdmin', authenticatJson);
// router.remove('/removeUser', authenticatJson);



module.exports = router;
