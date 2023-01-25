"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnection = void 0;
require("dotenv/config");
const pg_1 = require("pg");
const { PG_DEV_PORT, PG_DEV_HOST, PG_DEV_DB, PG_DEV_USER, PG_DEV_PASSWORD, PG_TEST_PORT, PG_TEST_HOST, PG_TEST_DB, PG_TEST_USER, PG_TEST_PASSWORD, } = process.env;
function setConfig() {
    var _a;
    if (((_a = process.env.ENVIRONMENT) === null || _a === void 0 ? void 0 : _a.trimEnd().split("'").join('')) === 'test')
        return {
            host: PG_TEST_HOST,
            port: parseInt(PG_TEST_PORT),
            database: PG_TEST_DB,
            user: PG_TEST_USER,
            password: PG_TEST_PASSWORD,
        };
    return {
        host: PG_DEV_HOST,
        port: parseInt(PG_DEV_PORT),
        database: PG_DEV_DB,
        user: PG_DEV_USER,
        password: PG_DEV_PASSWORD,
    };
}
const DBConnection = new pg_1.Pool(setConfig());
exports.DBConnection = DBConnection;
