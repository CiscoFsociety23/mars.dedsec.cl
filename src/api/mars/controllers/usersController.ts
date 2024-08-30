import express, { Request, Response, Router } from 'express';
import { UserService } from '../services/usersService';
import { Users, UserBody, ServiceResponse, UserLogin } from '../interfaces/models/users';
import { UserMiddleware } from '../middleware/usersMiddleware';
import { EmailService } from '../services/emailService';

const userController: Router = express.Router();
const userMiddleware: UserMiddleware = new UserMiddleware();
const userService: UserService = new UserService();
const emailService: EmailService = new EmailService();

userController.get('/', async (req: Request, res: Response) => {
    try {
        const { email } = req.query;
        if(email){
            const getUserByEmail: Users = await userService.getUserByEmail(String(email));
            res.json(getUserByEmail);
        } else {
            const getUsers: Users[] = await userService.getUsers();
            res.json(getUsers);
        };
    } catch (error) {
        console.log(`[error]: ${error}`);
        res.json({ status: false });
    };
});

userController.post('/create', userMiddleware.checkIfExists, async (req: Request, res: Response) => {
    try {
        const userBody: UserBody = req.body;
        const createUser: ServiceResponse = await userService.createUser(userBody);
        emailService.sendWelcomeMail(userBody.email, 'Bienvenido a Dedsec Corp', userBody.name);
        const tokenValidation = await userService.getValidationToken(userBody.email);
        console.log(`[info]: Se asigna un token de validacion a la cuenta ${userBody.email}`);
        setTimeout(() => {
            emailService.sendValidationMail(userBody.email, 'Validacion de Cuenta', tokenValidation.token);
        }, 5000);
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
        const checkAccess: boolean = await userService.checkAccess(userAccess.email, userAccess.passwd);
        if(checkAccess === true){
            const status = await userService.getStatusAccount(userAccess.email);
            if(status){
                const token: string = await userService.getToken(userAccess.email);
                res.json({ access: checkAccess, token });
            } else {
                res.json({ status: false, message: 'Debe validar su cuenta, hemo enviado un correo para confirmar su acceso' });
            }
        } else {
            res.json({ status: false });
        };
    } catch (error) {
        console.log(`[error]: ${error}`);
        res.json({ status: false });
    };
});

userController.get('/validate', async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        const userEmail = atob(String(token).split('.')[1]).split('"')[3];
        const verification = await userService.verifyAccount(String(token));
        if(verification == true){
            userService.updateStatusAccount(userEmail);
            res.redirect('/');
        } else {
            const tokenValidation = await userService.getValidationToken(userEmail);
            emailService.sendValidationMail(userEmail, 'Validacion de Cuenta', tokenValidation.token);
            res.redirect('/no-validado');
        };
    } catch (error) {
        console.log(`[error]: ${error}`);
        res.json({ status: false });
    };
});

export { userController };
