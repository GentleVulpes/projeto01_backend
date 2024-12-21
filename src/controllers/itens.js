const path = require('path');
const fs = require('fs');

const databasePath = path.join(__dirname, '../models/itens.json');
const utils = require('./utils');

class Item {
    constructor (_name, _rarity, _email) {
        this.name = _name;
        this.email = _email;
        this.rarity = _rarity;
    }
}

function itemExist(_itens, _email){

    const targetItem = _itens.findIndex(item => item.email === _email);
    return targetItem === -1 ? false : true;
}

function createItem(req, res){
    const { name, rarity, email } = req.params;
    const data = utils.getDatabase(req, res, databasePath);
    let itens = JSON.parse(data);

    if(itemExist(itens, email)){
        return res.status(409).json('This user already have an item!');
    }

    let newItem = new Item(name, rarity, email);

    itens.length === 0 ? itens[0] = newItem : itens.push(newItem);

    utils.writeAtDatabase(req, res, itens, databasePath);//sobrescreve-se o banco de dados no formato json.

    return res.status(201).json(fs.readFileSync(databasePath, 'utf8'));//imprime o banco de dados na tela.

}

function updateItem(req, res) {
        const data = utils.getDatabase(req, res, databasePath);
        const { name, rarity, email} = req.params;
        let itens = JSON.parse(data);
        
        const targetItemIndex = itens.findIndex(item => item.email === email);
 
        if(targetItemIndex === -1) {
            return res.status(404).json('item not found!');
        }
        else {
            itens[targetItemIndex].name = name;
            itens[targetItemIndex].rarity = rarity;
            utils.writeAtDatabase(req, res, itens, databasePath);
            return res.status(200).json('Item updated!');
        }
}
function deleteItem(req, res) {
    const { email } = req.params; //recebe o e-mail do corpo da requisição.
    const data = utils.getDatabase(req, res, databasePath); //recebe o banco de dados no formato json.

    let itens = JSON.parse(data); //converte data do formato json para um array.
    if(!itemExist(itens, email)) { //se o usuário não existir.
        return res.status(404).json('Nenhum usuário foi encontrado.');
    }
    itens = itens.filter(user => user.email !== email); 

    utils.writeAtDatabase(req, res, itens, databasePath);
    
    return res.status(204).json("item excluído com sucesso!");
    
}

function listItens(req, res) {
    let { limite, pagina } = req.params;
    const data = utils.getDatabase(req, res, databasePath);
    let itens = JSON.parse(data);

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

    itens = itens.slice(comeco, final);
    return res.status(200).json(itens);
}

module.exports = { createItem, updateItem, deleteItem, listItens };