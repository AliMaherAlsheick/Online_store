"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("./users");
const products_1 = require("./products");
const orders_1 = require("./orders");
const appRoutes = express_1.default.Router();
exports.appRoutes = appRoutes;
appRoutes.use('/user', users_1.usersRoutes);
appRoutes.use('/product', products_1.productsRoutes);
appRoutes.use('/order', orders_1.ordersRoutes);
