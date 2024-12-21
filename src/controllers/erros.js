class NotFound extends Error {
    constructor(_type) {
        super(_type + " not found!");
        this.name = this.constructor.name;
        this.statusCode = 404;
    }
}

class AlreadyExists extends Error {
    constructor(_type) {
        super(_type + " already exists!");
        this.name = this.constructor.name;
        this.statusCode = 409;
    }
}

class NotExists extends Error {
    constructor(_type) {
        super(_type + " cannot be found!");
        this.name = this.constructor.name;
        this.statusCode = 404;
    }
}

class WrongPassword extends Error {
    constructor() {
        super("Wrong password!");
        this.name = this.constructor.name;
        this.statusCode = 401;
    }
}

class InvalidLimitNumber extends Error {
    constructor() {
        super('numero de limite inválido, o limite deve ser 5, 10 ou 15!');
        this.name = this.constructor.name;
        this.statusCode = 400;
    }
}

class InvalidPageNumber extends Error {
    constructor() {
        super('o número de paginas deve ser no mínimo de 1!');
        this.name = this.constructor.name;
        this.statusCode = 400;
    }
}

class TokenCreationError extends Error {
    constructor() {
        super('Cannot create token!');
        this.name = this.constructor.name;
        this.statusCode = 500;
    }
}

class TokenAuthenticationError extends Error {
    constructor() {
        super('Cannot authenticate token!');
        this.name = this.constructor.name;
        this.statusCode = 403;
    }
}

module.exports = { NotFound, AlreadyExists, InvalidLimitNumber, InvalidPageNumber, NotExists, WrongPassword, TokenCreationError, TokenAuthenticationError };
