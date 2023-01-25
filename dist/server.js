"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e;
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
const port = (((_a = process.env.ENVIRONMENT) === null || _a === void 0 ? void 0 : _a.trimEnd().split("'").join('')) === 'development'
    ? (_b = process.env.STORE_DEV_PORT) === null || _b === void 0 ? void 0 : _b.trimEnd().split("'").join('')
    : ((_c = process.env.ENVIRONMENT) === null || _c === void 0 ? void 0 : _c.trimEnd().split("'").join('')) === 'test'
        ? (_d = process.env.STORE_TEST_PORT) === null || _d === void 0 ? void 0 : _d.trimEnd().split("'").join('')
        : (_e = process.env.STORE_PRO_PORT) === null || _e === void 0 ? void 0 : _e.trimEnd().split("'").join(''));
const address = 'http://localhost:' + port;
app.use((0, cors_1.default)(config));
app.use(body_parser_1.default.json());
app.use(mainRoute_1.appRoutes);
app.listen(port, function () {
    console.log(`starting app on: ${address}`);
});
