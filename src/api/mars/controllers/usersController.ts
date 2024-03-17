import express, { Request, Response, Router } from 'express';

const userController: Router = express.Router();

userController.get('/', (req: Request, res: Response) => {
    try {
        res.json({ status: true });
    } catch (error) {
        console.log(`[error]: ${error}`);
    };
});

export { userController };