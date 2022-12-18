"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middelwares/authentication");
const orders_1 = require("../services/orders");
const ordersRoutes = express_1.default.Router();
exports.ordersRoutes = ordersRoutes;
ordersRoutes.get('/:id', authentication_1.userCheck, orders_1.show);
ordersRoutes.get('/', authentication_1.adminCheck, orders_1.index);
ordersRoutes.post('/', authentication_1.userCheck, orders_1.create);
ordersRoutes.delete('/:Id', authentication_1.userCheck, orders_1.remove);
ordersRoutes.patch('/', authentication_1.userCheck, orders_1.update);
ordersRoutes.patch('/:Id', authentication_1.userCheck, orders_1.updateOrderProduct);
ordersRoutes.delete('/', authentication_1.userCheck, orders_1.removeOrder);
