const path = require('path');
const fs = require('fs');

const databasePath = path.join(__dirname, '../models/characters.json');
const utils = require('./utils');
const{ AlreadyExists, InvalidLimitNumber, InvalidPageNumber, NotExists } = require('./erros');

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
        if(characterExist) {
            throw new AlreadyExists('Character');
        }


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
        throw new NotFound('Character');
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
        throw NotExists('User');
    }
    characters = characters.filter(user => user.email !== email); 

    utils.writeAtDatabase(req, res, characters, databasePath);
    
    return res.status(204).json("Item removed!");
        
}

function listCharacters(req, res) {
    let { limite, pagina } = req.params;
    const data = utils.getDatabase(req, res, databasePath);
    let characters = JSON.parse(data);

    limite = parseInt(limite);
    pagina = parseInt(pagina);

    if(![5, 10, 15].includes(limite)) {
        throw new InvalidLimitNumber();
    }
    if(pagina < 1) {
        throw new InvalidPageNumber();
    }

    const comeco = (pagina - 1) * limite;
    const final = comeco + limite;

    characters = characters.slice(comeco, final);
    return res.status(200).json(characters);
}

function listNumbeOfRacePlayers(req, res) {
    const { race } = req.params;
    const data = utils.getDatabase(databasePath);
    const characters = JSON.parse(data);
    let counter = 0;
    characters.forEach( (character) => {
        if(character,race == race) {
            counter++;
        }
    });
    res.send("Number of players of the " + race + " race is " + counter, " players");
}

module.exports = { createCharacter, updateCharacter, deleteCharacter, listCharacters, listNumbeOfRacePlayers };