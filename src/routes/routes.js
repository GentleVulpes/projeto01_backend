const path = require('path');
const express = require('express');
const router = express.Router();
const { createUser, signIn, deleteUser, verifyAdminExistence, updateUser, listUsers } = require('../controllers/users');
const { createCharacter, updateCharacter, deleteCharacter, listCharacters, listNumbeOfRacePlayers } = require('../controllers/characters');
const { createItem, updateItem, deleteItem, listItens } = require('../controllers/itens');
const { createToken, validateToken } = require('../controllers/utils');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

//GENERAL
router.post('/user/login/:name/:email/:password', signIn);
router.get('/install', verifyAdminExistence);

//ADMIN - USER
router.get('/admin/user/list/:limite/:pagina', validateToken, listUsers);
router.post('/admin/user/register/:name/:email/:password',  validateToken, createUser(true));
router.put('/admin/user/update/:id/:name/:email/:password', validateToken, updateUser);
router.delete('/admin/user/delete/:id/:name/:email/:password', validateToken, deleteUser);
router.get('/admin/listNumberOfPlayersOfRace/:race', listNumbeOfRacePlayers);

//ADMIN - ITEM
router.get('/admin/item/list/:limite/:pagina', validateToken, listItens);
router.post('/admin/item/register/:name/:rarity/:email', validateToken, createItem);
router.put('/admin/item/update/:name/:rarity/:email', validateToken, updateItem);
router.delete('/admin/item/delete/:email', validateToken, deleteItem);

//ADMIN - CHARACTER
router.get('/admin/character/list/:limite/:pagina', validateToken, listCharacters);
router.post('/admin/character/register/:name/:level/:race/:email',validateToken, createCharacter);
router.put('/admin/character/update/:name/:level/:race/:email',validateToken, updateCharacter);
router.delete('/admin/character/delete/:email',validateToken, deleteCharacter);



//USER
router.post('/user/register/:name/:email/:password', createUser(false));
router.put ('/user/update/:name/:email/:password',validateToken, updateUser);


//USER - CHARACTER
router.post('/register/user/:email/character/:name/:level/:race',validateToken, createCharacter);



module.exports = router;
