const path = require('path');

function mainPage(req, res) {
    res.sendFile(path.join(__dirname, '../html/index.html'));
}

function signupPage(req, res) {
    res.sendFile(path.join(__dirname, '../html/signup.html'));
}

function deletePage(req, res) {
    res.sendFile(path.join(__dirname, '../html/delete.html'));
}

function userUpdatePage(req, res) {
    res.sendFile(path.join(__dirname, '../html/userUpdate.html'))
}


module.exports = { signupPage, deletePage, mainPage, userUpdatePage };