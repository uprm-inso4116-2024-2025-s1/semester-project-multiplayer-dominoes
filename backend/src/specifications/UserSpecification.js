// UserSpecifications.js
class Specification {
    isSatisfiedBy(candidate) {
        throw new Error('Method not implemented.');
    }
}

class EmailAvailableSpecification extends Specification {
    constructor(userHandler) {
        super();
        this.userHandler = userHandler;
    }

    async isSatisfiedBy(email) {
        const existingUser = await this.userHandler.findUserByEmail(email);
        return !existingUser;
    }
}

class UsernameAvailableSpecification extends Specification {
    constructor(userHandler) {
        super();
        this.userHandler = userHandler;
    }

    async isSatisfiedBy(username) {
        const existingUser = await this.userHandler.findUserByUsername(username);
        return !existingUser;
    }
}

export { EmailAvailableSpecification, UsernameAvailableSpecification };
