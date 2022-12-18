import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cors from 'cors';
import { appRoutes } from './routes/mainRoute';
export { app };
const app: express.Application = express();
const config = {
    origin: 'http://www.example.com',
    optionsSuccessStatus: 200,
};
const port: string = (
    process.env.ENVIRONMENT === 'development'
        ? process.env.STORE_DEV_PORT
        : process.env.ENVIRONMENT === 'test'
        ? process.env.STORE_TEST_PORT
        : process.env.STORE_PRO_PORT
) as string;
const address: string = 'http://localhost:' + port;
app.use(cors(config));
app.use(bodyParser.json());
app.use(appRoutes);
app.listen(port, function () {
    console.log(`starting app on: ${address}`);
});
