import UsersHandler from "../handlers/UsersHandler.js";
import UsersController from "../controllers/UsersController.js";
import HealthCheckController from "../controllers/HealthCheckController.js";

const componentNames = Object.freeze({
    usersHandler: 'UsersHandler',
    usersController: 'UsersController',
    healthCheckController: 'HealthCheckController'
});

class Container {

    #container;

    constructor() {
        // Create empty private container
        this.#container = new Map();

        // Register Handlers
        this.#container.set(componentNames.usersHandler, new UsersHandler());
        
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
}

const mainContainer = new Container();

export default mainContainer;