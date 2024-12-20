const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const{ AlreadyExists, InvalidLimitNumber, InvalidPageNumber, WrongPassword, NotExists } = require('./erros');
const databasePath = path.join(__dirname, '../models/users.json');

class User {
    constructor(_name, _password, _email, _isAdmin, _id) {
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

function createUser (_isAdmin) {
    return (req, res) => {
        const { name, password, email } = req.params;
        const data = utils.getDatabase(req, res, databasePath); //recebe o banco de dados no formato json. 
        let users = JSON.parse(data);//converte do formato json para um arquivo js.

        if(userExist (email, users)) { //se o usuário existe.
            throw new AlreadyExists('User');
        }

        let  id = 0;
        users.length === 0 ? id = 1 : id = users.length + 1;
        newUser = new User(name, password, email, _isAdmin, id);
        
        users.length === 0 ? users[0] = newUser : users.push(newUser); //adiciona-se um novo usuário no array.
        
        utils.writeAtDatabase(req, res, users, databasePath);//sobrescreve-se o banco de dados no formato json.

        return res.status(201).json(fs.readFileSync(databasePath, 'utf8'));//imprime o banco de dados na tela.
        }
}

function signIn (req, res, next) {
    const { name, email, password } = req.params;
    const data = utils.getDatabase(req, res, databasePath); //recebe o banco de dados no formato json. 
    let users = JSON.parse(data);//converte do formato json para um arquivo js.


    findUser = users.find(user => (user.email === email));//procura o usuário registrado com este e-mail.

    if(findUser) { //se achou um usuário com o email passado por parâmetro.
        if(findUser.password !== password) {//verifica se o password passado por parâmetro é diferente do password do banco.
            throw new WrongPassword();
        }
        else {//se for igual ao password do banco.
            const token = utils.createToken(findUser);//cria um
            // utils.validateToken(req, res, next);
            return res.status(200).json('Logged Sucessfully!' + token);
        }
    } else {
        throw new NotExists('User');
    }
}

function updateUser (req, res) {
    const data = utils.getDatabase(req, res, databasePath);
    const { name, password, email, id} = req.params;
    let users = JSON.parse(data);
     targetUserIndex = users.findIndex(user => user.id == id);

    if(targetUserIndex === -1) {
        throw new NotExists('User');
    }
    else {
        users[targetUserIndex].name = name;
        users[targetUserIndex].password = password;
        users[targetUserIndex].email = email;
        utils.writeAtDatabase(req, res, users, databasePath);
        res.status(200).json('User updated!');
    }
}

function deleteUser (req, res) {
    const { email } = req.params; //recebe o e-mail do corpo da requisição.
    const data = utils.getDatabase(req, res, databasePath); //recebe o banco de dados no formato json.
    let users = JSON.parse(data); //converte data do formato json para um array.
    if(!userExist(email, users)) { //se o usuário não existir.
        throw new NotExists('User');
    }
    users = users.filter(user => user.email !== email); //retorna todos os usuários que tiverem o email(chave primária) diferentes do procurado.
    utils.writeAtDatabase(req, res, users, databasePath); //reescreve o json sem o usuário removido.
    
    return res.status(204).json("User removed!");

}

function verifyAdminExistence (req, res, next) {
    const data = utils.getDatabase(req, res, databasePath);
    let users = JSON.parse(data);

    const adminExist = users.findIndex(user => user.isAdmin === true && user.name ==='admin');  
    if(adminExist === -1) {
        const newUser = new User('admin', 'admin', 'admin@mail.com', true);
        users.length === 0 ? users[0] = (newUser) : users.push(newUser);
        utils.writeAtDatabase(req, res, users, databasePath);
        return res.status(201).json('Administrator created!');
    }
    else{
        throw new AlreadyExists('Admin');
    }
}

function listUsers(req, res) {
    let { limite, pagina } = req.params;
    const data = utils.getDatabase(req, res, databasePath);
    let users = JSON.parse(data);

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

    users = users.slice(comeco, final);
    return res.status(200).json(users);
}


module.exports = {createUser, signIn, updateUser, deleteUser, verifyAdminExistence, listUsers};