import { Request, Response } from 'express';
import { UserService } from "../services/usersService";
import { UserBody } from '../interfaces/models/users';
const userService: UserService = new UserService();

class UserMiddleware {

    public async checkIfExists(req: Request, res: Response, next: () => void){
        const userBody: UserBody = req.body;
        const check: boolean = await userService.getAccount(userBody.email);
        if(!check){
            return next();
        } else {
            console.log(`[error]: La cuenta ${userBody.email} ya exite. No se puede crear.`);
            res.json({ status: false });
        };
    };

}

export { UserMiddleware };
