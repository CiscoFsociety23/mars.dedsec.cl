import express, { Request, Response, Router } from 'express';
import { UserService } from '../services/usersService';
import { Users, UserBody, ServiceResponse, UserLogin } from '../interfaces/models/users';
import { UserMiddleware } from '../middleware/usersMiddleware';

const userController: Router = express.Router();
const userMiddleware: UserMiddleware = new UserMiddleware();
const userService: UserService = new UserService();

userController.get('/', async (req: Request, res: Response) => {
    try {
        const getUsers: Users[] = await userService.getUsers();
        res.json(getUsers);
    } catch (error) {
        console.log(`[error]: ${error}`);
        res.json({ status: false });
    };
});

userController.post('/create', userMiddleware.checkIfExists, async (req: Request, res: Response) => {
    try {
        const userBody: UserBody = req.body;
        const createUser: ServiceResponse = await userService.createUser(userBody);
        res.json(createUser);
    } catch (error) {
        console.log(`[error]: ${error}`);
        res.json({ status: false });
    };
});

userController.put('/update', async (req: Request, res: Response) => {
    try {
        const id = req.query.id;
        const userBody: UserBody = req.body;
        const updateUser: ServiceResponse = await userService.updateUser(Number(id), userBody);
        res.json(updateUser)
    } catch (error) {
        console.log(`[error]: ${error}`);
        res.json({ status: false });
    };
});

userController.delete('/delete', async (req: Request, res: Response) => {
    try {
        const id = req.query.id;
        const deleteUser: ServiceResponse = await userService.deleteUser(Number(id));
        res.json(deleteUser);
    } catch (error) {
        console.log(`[error]: ${error}`);
        res.json({ status: false });
    };
});

userController.post('/check', async (req: Request, res: Response) => {
    try {
        const userAccess: UserLogin = req.body;
        const checkAccess = await userService.checkAccess(userAccess.email, userAccess.passwd);
        res.json({ access: checkAccess });
    } catch (error) {
        console.log(`[error]: ${error}`);
        res.json({ status: false });
    };
});

export { userController };
