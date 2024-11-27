import UsersHandler from "../handlers/UsersHandler.js";
import MatchHandler from "../handlers/MatchHandler.js";
import UsersController from "../controllers/UsersController.js";
import HealthCheckController from "../controllers/HealthCheckController.js";
import MatchController from "../controllers/matchController.js";
import UserRepository from "../repositories/UserRepository.js";
import MatchRepository from "../repositories/MatchRepository.js";
import RoomRepository from "../repositories/RoomRepository.js";
import AchievementRepository from "../repositories/AchievementRepository.js";
import UserModel from "../models/UserModel.js";
import MatchModel from "../models/MatchModel.js";
import RoomsModel from "../models/RoomsModel.js";
import AchievementModel from "../models/AchievementModel.js";

const componentNames = Object.freeze({
    usersHandler: 'UsersHandler',
    matchHandler: 'MatchHandler',

    usersController: 'UsersController',
    healthCheckController: 'HealthCheckController',
    matchController: 'MatchController',
    
    usersRepository: 'UsersRepository',
    matchRepository: 'MatchRepository',
    roomRepository: 'RoomRepository',
    achievementRepository: 'AchievementRepository',
    matchRepository: 'MatchRepository',
});

class Container {

    #container;

    constructor() {
        // Create empty private container
        this.#container = new Map();

        // Register Repositories
        this.#container.set(componentNames.usersRepository, new UserRepository(UserModel));
        this.#container.set(componentNames.matchRepository, new MatchRepository(MatchModel));
        this.#container.set(componentNames.roomRepository, new RoomRepository(RoomsModel));
        this.#container.set(componentNames.achievementRepository, new AchievementRepository(AchievementModel));

        // Register Handlers
        this.#container.set(componentNames.usersHandler, 
            new UsersHandler(this.#container.get(componentNames.usersRepository)));
        this.#container.set(componentNames.matchHandler,
            new MatchHandler(
                this.#container.get(componentNames.matchRepository), 
                this.#container.get(componentNames.roomRepository)));
        
        // Register Controllers
        this.#container.set(componentNames.healthCheckController, new HealthCheckController());
        this.#container.set(componentNames.usersController, 
            new UsersController(this.#container.get(componentNames.usersHandler)));
        this.#container.set(componentNames.matchController,
            new MatchController(this.#container.get(componentNames.matchHandler)));
    }

    get HealthCheckController() {
        return this.#container.get(componentNames.healthCheckController);
    }

    get MatchController() {
        return this.#container.get(componentNames.matchController);
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