"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const mainRoute_1 = require("./routes/mainRoute");
const app = (0, express_1.default)();
exports.app = app;
const config = {
    origin: 'http://www.example.com',
    optionsSuccessStatus: 200,
};
const port = (process.env.ENVIRONMENT === 'development'
    ? process.env.STORE_DEV_PORT
    : process.env.ENVIRONMENT === 'test'
        ? process.env.STORE_TEST_PORT
        : process.env.STORE_PRO_PORT);
const address = 'http://localhost:' + port;
app.use((0, cors_1.default)(config));
app.use(body_parser_1.default.json());
app.use(mainRoute_1.appRoutes);
app.listen(port, function () {
    console.log(`starting app on: ${address}`);
});
