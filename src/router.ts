import express, { Express, Router } from 'express';
import { marsController } from './api/mars/controllers/marsController';
import { userController } from './api/mars/controllers/usersController';

class Routing {

    public apiRouter(app: Express) {
        const router: Router = express.Router();
        app.use('/api-mars/', marsController);
        app.use('/api-mars/users', userController);
    };

};

export { Routing };
