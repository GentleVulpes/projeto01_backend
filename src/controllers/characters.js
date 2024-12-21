const path = require('path');
const fs = require('fs');

const databasePath = path.join(__dirname, '../models/characters.json');
const utils = require('./utils');

class  Character {
    constructor (_name, _level, _race, _email) {
        this.name = _name;
        this.level = _level;
        this.race = _race;
        this._email = _email;
    }
}

function characterExist(_characters, _email){

    const targetCharacter = _characters.findIndex(character => character.email === _email);
    return targetCharacter === -1 ? false : true;
}

function createCharacter(req, res) {
     const { name, level, race, email } = req.params;
        const data = utils.getDatabase(req, res, databasePath);
    
        let characters = JSON.parse(data);
        
        let newCharacter = new Character(name, level, race, email);
    
        characters.length === 0 ? characters[0] = newCharacter : characters.push(newCharacter);
    
        utils.writeAtDatabase(req, res, characters, databasePath);//sobrescreve-se o banco de dados no formato json.
    
        return res.status(201).json(fs.readFileSync(databasePath, 'utf8'));//imprime o banco de dados na tela.
}

function updateCharacter(req, res) {
    const data = utils.getDatabase(req, res, databasePath);
    const { name, rarity, email} = req.params;
    let characters = JSON.parse(data);
    
    const targetCharacterIndex = characters.findIndex(character => character.email === email);

    if(targetCharacterIndex === -1) {
        return res.status(404).json('Character not found!');
    }
    else {

        characters[targetCharacterIndex].name = name;
        characters[targetCharacterIndex].level = level;
        characters[targetCharacterIndex].race = race;

        utils.writeAtDatabase(req, res, characters, databasePath);

        return res.status(200).json('Character updated!');
    }
}

function deleteCharacter(req, res) {
    const { email } = req.params; //recebe o e-mail do corpo da requisição.
    const data = utils.getDatabase(req, res, databasePath); //recebe o banco de dados no formato json.

    let characters = JSON.parse(data); //converte data do formato json para um array.
    if(!characterExist(characters, email)) { //se o usuário não existir.
        return res.status(404).json('Nenhum usuário foi encontrado.');
    }
    characters = characters.filter(user => user.email !== email); 

    utils.writeAtDatabase(req, res, characters, databasePath);
    
    return res.status(204).json("item excluído com sucesso!");
        
}

function listCharacters(req, res) {
    let { limite, pagina } = req.params;
    const data = utils.getDatabase(req, res, databasePath);
    let characters = JSON.parse(data);

    limite = parseInt(limite);
    pagina = parseInt(pagina);

    if(![5, 10, 15].includes(limite)) {
        return res.status(400).json('numero de limite inválido, o limite deve ser 5, 10 ou 15');
    }
    if(pagina < 1) {
        return res.status(400).json('o número de paginas deve ser no mínimo de 1');
    }

    const comeco = (pagina - 1) * limite;
    const final = comeco + limite;

    characters = characters.slice(comeco, final);
    return res.status(200).json(characters);
}

module.exports = { createCharacter, updateCharacter, deleteCharacter, listCharacters };