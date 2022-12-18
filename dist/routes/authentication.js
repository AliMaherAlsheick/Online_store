"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenRoute = void 0;
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middelwares/authentication");
const authentication_2 = require("../services/authentication");
const authenRoute = express_1.default.Router();
exports.authenRoute = authenRoute;
authenRoute.post('/logIn', authentication_2.logIn);
authenRoute.post('/signUp', authentication_2.signUp);
authenRoute.delete('/:id', authentication_1.userCheck, authentication_2.remove);
authenRoute.patch('/:id', authentication_1.userCheck, authentication_2.update);
authenRoute.get('/', authentication_1.userCheck, authentication_2.index);
authenRoute.get('/Id', authentication_1.userCheck, authentication_2.show);
authenRoute.patch('/Id', authentication_2.update);
