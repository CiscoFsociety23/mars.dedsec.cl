import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Routing } from './router';

const app: Express = express();
const routing: Routing = new Routing();
dotenv.config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

routing.apiRouter(app);

app.listen(process.env.PORT, () => {
    console.log(`[info]: Aplicacion Desplegada`);
    console.log(`[info]: Puerto: ${process.env.PORT}`);
});
