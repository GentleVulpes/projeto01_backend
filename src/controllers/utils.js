const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const{ AlreadyExists, InvalidLimitNumber, InvalidPageNumber, WrongPassword, NotExists, TokenCreationError, TokenAuthenticationError } = require('./erros');

function createToken(_payload) {

    const token = jwt.sign(_payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIME });

    if(token) {
        return token;
    }else{
        throw new TokenCreationError();
    }
}

function validateToken(req, res, next) {
    const token = req.headers['authorization'];
    if(token.startWith('Bearer')) {
        token = token.split(' ')[1];
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch(error) {
        throw new TokenAuthenticationError();
    }
    next();
}

function verifyToken(_req, _res, _next, _token, _key) {
    const hasToken = req.headers['authorization'];
    if(!hasToken) {
        return res.status(401).json('não possui autorização para acessar esta página!');
    }
    jwt.verify(_token, _key, (error, decoded) => {
        if(error) {
            throw new TokenAuthenticationError();
        }
    });
    next();
}

function getDatabase(_req, _res, _path) {
    if(fs.existsSync(_path)) { //se o arquivo contendo o banco de dados existir.
        let data = null;

        try {
            data = fs.readFileSync(_path, 'utf8');//lê-se o arquivo json contendo o banco de dados.
        }
        catch(error) {
            throw new NotExists('Database');
        }
        return data;
    }else {
        throw new NotExists('Database');
    }
}

function writeAtDatabase(_req, _res, _dataJS, _path) {//adiciona o conteúdo a váriavel contendo o array com os dados.
    try {
        fs.writeFileSync(_path, JSON.stringify(_dataJS));    
    }
    catch (error) {
        throw new NotExists('Database');
    }
    return;
}

module.exports = { createToken, getDatabase, writeAtDatabase, validateToken };