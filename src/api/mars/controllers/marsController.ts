import express, { Router, Request, Response } from "express";
import { MarsService } from "../services/marsService";

const marsController: Router = express.Router();
const marsService: MarsService = new MarsService();

marsController.get('/', async (req: Request, res: Response) => {
    try {
        res.json({ status: await marsService.getServiceStatus() });
    } catch (error) {
        console.log(`[error]: ${error}`);
        res.json({ status: false });
    };
});

export { marsController };
