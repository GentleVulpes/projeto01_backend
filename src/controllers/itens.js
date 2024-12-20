const path = require('path');
const fs = require('fs');

const databasePath = path.join(__dirname, '../databases/itens.json');
const utils = require('./utils');

class Item {
    constructor (_name, _quantity, _email, _id) {
        this.name = _name;
        this.quantity = _quantity;
        this._email = _email;
        this.id = _id;
    }
}

function createItem(req, res){
    const { name, quantity, email } = req.params;
    const data = utils.getDatabase(req, res, databasePath);

    let itens = JSON.parse(data);
    let id = 0;

    itens.length === 0 ? id = 1 : id = itens.length + 1;
    let newItem = new Item(name, quantity, email, id);

    itens.length === 0 ? itens[0] = newItem : itens.push(newItem);

    utils.writeAtDatabase(req, res, itens, databasePath);//sobrescreve-se o banco de dados no formato json.

    return res.status(201).json(fs.readFileSync(databasePath, 'utf8'));//imprime o banco de dados na tela.

}

module.exports = { createItem };