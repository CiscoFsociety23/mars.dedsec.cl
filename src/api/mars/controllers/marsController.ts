import express, { Router, Request, Response } from "express";
import { MarsService } from "../services/marsService";
import { serviceInformation } from "../interfaces/controllers/informationsInterface";

const marsController: Router = express.Router();
const marsService: MarsService = new MarsService();

marsController.get('/', async (req: Request, res: Response) => {
    try {
        const getStatus: serviceInformation = await marsService.getServiceStatus();
        res.json(getStatus);
    } catch (error) {
        console.log(`[error]: ${error}`);
        res.json({ status: false });
    };
});

export { marsController };
