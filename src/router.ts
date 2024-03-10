import express, { Express, Router } from 'express';
import { marsController } from './api/mars/controllers/marsController';

class Routing {

    public apiRouter(app: Express) {
        const router: Router = express.Router();
        app.use('/api/', marsController);
    };

};

export { Routing };
