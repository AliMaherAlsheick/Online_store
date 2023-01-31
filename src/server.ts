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
    process.env.ENVIRONMENT?.trimEnd().split("'").join('') === 'development'
        ? process.env.STORE_DEV_PORT?.trimEnd().split("'").join('')
        : process.env.ENVIRONMENT?.trimEnd().split("'").join('') === 'test'
        ? process.env.STORE_TEST_PORT?.trimEnd().split("'").join('')
        : process.env.STORE_PRO_PORT?.trimEnd().split("'").join('')
) as string;
const address: string = 'http://localhost:' + port ?? 3000;
app.use(cors(config));
app.use(bodyParser.json());
app.use(appRoutes);
app.listen(port, function () {
    console.log(`starting app on: ${address}`);
});
