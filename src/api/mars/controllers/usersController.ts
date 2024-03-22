import express, { Request, Response, Router } from 'express';
import { UserService } from '../services/usersService';
import { Users, UserBody, ServiceResponse } from '../interfaces/models/users';

const userController: Router = express.Router();
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

userController.post('/create', async (req: Request, res: Response) => {
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

export { userController };
