"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middelwares/authentication");
const users_1 = require("../services/users");
const usersRoutes = express_1.default.Router();
exports.usersRoutes = usersRoutes;
usersRoutes.post('/logIn', users_1.logIn);
usersRoutes.post('/', users_1.signUp);
usersRoutes.get('/', authentication_1.adminCheck, users_1.index);
usersRoutes.get('/:id', authentication_1.userCheck, users_1.show);
usersRoutes.delete('/:id', authentication_1.userCheck, users_1.remove);
usersRoutes.patch('/:id', authentication_1.userCheck, users_1.update);
