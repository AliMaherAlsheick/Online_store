import 'dotenv/config';
import { Pool, PoolConfig } from 'pg';
export { DBConnection };
const {
    PG_DEV_PORT,
    PG_DEV_HOST,
    PG_DEV_DB,
    PG_DEV_USER,
    PG_DEV_PASSWORD,
    PG_TEST_PORT,
    PG_TEST_HOST,
    PG_TEST_DB,
    PG_TEST_USER,
    PG_TEST_PASSWORD,
} = process.env;
function setConfig(): PoolConfig {
    if (process.env.ENVIRONMENT?.trimEnd().split("'").join('') === 'test')
        return {
            host: (PG_TEST_HOST as string) ?? '127.0.0.1',
            port: parseInt(PG_TEST_PORT as string) ?? 5432,
            database: (PG_TEST_DB as string) ?? 'shopping',
            user: PG_TEST_USER as string,
            password: PG_TEST_PASSWORD as string,
        };
    return {
        host: (PG_DEV_HOST as string) ?? '127.0.0.1',
        port: parseInt(PG_DEV_PORT as string) ?? 5432,
        database: (PG_DEV_DB as string) ?? 'shopping_test',
        user: PG_DEV_USER as string,
        password: PG_DEV_PASSWORD as string,
    };
}
const DBConnection = new Pool(setConfig());
