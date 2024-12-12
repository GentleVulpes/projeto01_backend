const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const utils = require('./utils');

const databasePath = path.join(__dirname, '../databases/users.json');

class User {
    constructor(_name, _password, _email, _isAdmin, _id){
        this.email = _email;
        this.name = _name;
        this.password = _password;
        this.isAdmin = _isAdmin;
        this.id = _id;
    }
};


function userExist (_email, _users) {//verifica se o usuário existe no banco.
    const exist = _users.findIndex(user => (user.email === _email)) !== -1 ? true : false;
    return exist;
}


function userLogin (req, res, _users, _email, _password) {
    const { email, password } = req.body; 
    if(userExist(email)) {
        const targetUser = _users.find((user)=>user.email === email);

        if(targetUser.password === password) {
            utils.createToken(targetUser);
        }
        res.status(404).JSON('senha ou número de email inválido');
    }
}




function createUser (req, res) {
    const { name, password, email } = req.body;
    const data = utils.getDatabase(req, res, databasePath);//recebe o banco de dados no formato json. 
    let users = JSON.parse(data);//converte do formato json para um arquivo js.

    if(userExist (email, users)) { //se o usuário existe.
        return res.status(404).json("O usuário já existe!");//caso encontre um usuário, retorna um erro 404. 
    }

    let  id = 0;
    console.log('tamanho de users: ', users.length); 
    users.length === 0 ? id = 1 : id = users.length + 1;
    newUser = new User(name, password, email, false, id);
    
    users.length === 0 ? users[0] = newUser : users.push(newUser); //adiciona-se um novo usuário no array.
    
    utils.writeAtDatabase(req, res, users, databasePath);//sobrescreve-se o banco de dados no formato json.

    return res.status(201).json(fs.readFileSync(databasePath, 'utf8'));//imprime o banco de dados na tela.

}

function registeredUser(req, res) {
    res.sendFile(path.join(__dirname,'../database/users.json'));
}

function listUsers (req, res) {
    return res.status(200).json(users);
}


function deleteUser (req, res) {
    const { email } = req.body; //recebe o e-mail do corpo da requisição.
    const data = utils.getDatabase(req, res, databasePath); //recebe o banco de dados no formato json.
    let users = JSON.parse(data); //converte data do formato json para um array.

    if(!userExist(email, users)) { //se o usuário não existir.
        return res.status(404).json('Nenhum usuário foi encontrado.');
    }
    users = users.filter(user => user.email !== email); //retorna todos os usuários que tiverem o email(chave primária) diferentes do procurado.
    utils.writeAtDatabase(req, res, users, databasePath); //reescreve o json sem o usuário removido.
    
    return res.status(200).json("Usuário excluído com sucesso!");

}
    

function updateUser (req, res) {
    const data = utils.getDatabase(req, res, databasePath);
    const { name, password, email} = req.body;
    let users = [];
    
    targetUserIndex = users.findIndex(user => user.email === email);
    if(targetUserIndex === -1) {
        return res.status(404).json('Nenhum usuário foi encontrado.');
    }
    else {
        users[targetUserIndex].name = name;
        users[targetUserIndex].password = password;
    }
}

function verifyAdminExistence (req, res, next) {
    const data = utils.getDatabase(req, res, databasePath);
    let users = JSON.parse(data);

    const adminExist = users.findIndex(user => user.isAdmin === true);  
    if(adminExist === -1) {
        const newUser = new User('admin', 'admin', 'admin@mail.com', true);
        users.length === 0 ? users[0] = (newUser) : users.push(newUser);
    }
    
    utils.writeAtDatabase(req, res, users, databasePath);
    next();
}


module.exports = { verifyAdminExistence, createUser, registeredUser, deleteUser, updateUser, userLogin };