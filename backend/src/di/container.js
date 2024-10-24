import UsersHandler from "../handlers/UsersHandler.js";
import UsersController from "../controllers/UsersController.js";
import HealthCheckController from "../controllers/HealthCheckController.js";
import UserRepository from "../repositories/UserRepository.js";
import MatchRepository from "../repositories/MatchRepository.js";
import RoomRepository from "../repositories/RoomRepository.js";
import UserModel from "../models/UserModel.js";
import MatchModel from "../models/MatchModel.js";
import RoomModel from "../models/RoomModel.js";

const componentNames = Object.freeze({
    usersHandler: 'UsersHandler',
    usersController: 'UsersController',
    usersRepository: 'UsersRepository',
    matchRepository: 'MatchRepository',
    roomRepository: 'RoomRepository',
    healthCheckController: 'HealthCheckController'
});

class Container {

    #container;

    constructor() {
        // Create empty private container
        this.#container = new Map();

        // Register Repositories
        this.#container.set(componentNames.usersRepository, new UserRepository(UserModel));
        this.#container.set(componentNames.matchRepository, new MatchRepository(MatchModel));
        this.#container.set(componentNames.roomRepository, new RoomRepository(RoomModel));

        // Register Handlers
        this.#container.set(componentNames.usersHandler, 
            new UsersHandler(this.#container.get(componentNames.usersRepository)));
        
        // Register Controllers
        this.#container.set(componentNames.healthCheckController, new HealthCheckController());
        this.#container.set(componentNames.usersController, 
            new UsersController(this.#container.get(componentNames.usersHandler)));
    }

    get HealthCheckController() {
        return this.#container.get(componentNames.healthCheckController);
    }

    get UsersHandler() {
        return this.#container.get(componentNames.usersHandler);
    }

    get UsersController() {
        return this.#container.get(componentNames.usersController);
    }

    get UserRepository() {
        return this.#container.get(componentNames.usersRepository);
    }
}

const mainContainer = new Container();

export default mainContainer;