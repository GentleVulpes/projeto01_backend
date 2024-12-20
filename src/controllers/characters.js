const path = require('path');
const fs = require('fs');

const databasePath = path.join(__dirname, '../databases/characters.json');
const utils = require('./utils');

class  Character {
    constructor (_name, _level, _race, _email, _id) {
        this.name = _name;
        this.level = _level;
        this.race = _race;
        this._email = _email;
        this.id = _id;

    }
}

function createCharacter(req, res) {
     const { name, level, race, email } = req.params;
        const data = utils.getDatabase(req, res, databasePath);
    
        let characters = JSON.parse(data);
        let id = 0;
    
        characters.length === 0 ? id = 1 : id = characters.length + 1;
        
        let newCharacter = new Character(name, level, race, email, id);
    
        characters.length === 0 ? characters[0] = newCharacter : characters.push(newCharacter);
    
        utils.writeAtDatabase(req, res, characters, databasePath);//sobrescreve-se o banco de dados no formato json.
    
        return res.status(201).json(fs.readFileSync(databasePath, 'utf8'));//imprime o banco de dados na tela.
}

module.exports = { createCharacter };