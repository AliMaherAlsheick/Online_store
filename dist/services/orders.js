"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOrder = exports.updateOrderProduct = exports.showUser = exports.update = exports.remove = exports.create = exports.show = exports.index = void 0;
const orders_1 = require("../models/orders");
const user_1 = require("../models/user");
const utilites_1 = require("../utilites/utilites");
function index(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.UserModel.select((_a = (0, utilites_1.Verfy)(req.headers.authorization)) === null || _a === void 0 ? void 0 : _a.id);
            let result;
            if (user.user_type === 'admin') {
                result = { msg: 'ok', result: yield orders_1.OrdersModel.selectAll() };
            }
            else {
                result = yield showUser(user.id);
            }
            res.send({ message: result.msg, result: result.result });
        }
        catch (error) {
            res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.index = index;
function show(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            if (!order)
                return res.status(404).json({ message: "Order does n't exist" });
            return res.status(200).json({ message: 'show', order });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.show = show;
function showUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield orders_1.OrdersModel.userOrders(id);
            if (!orders.length)
                return { msg: "Order does n't exist", result: [] };
            return { msg: 'show', result: [] };
        }
        catch (error) {
            return {
                msg: 'error encountered',
                result: error,
            };
        }
    });
}
exports.showUser = showUser;
function create(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let orderData = req.body;
            orderData.user_id = (_a = (0, utilites_1.Verfy)(req.headers.authorization)) === null || _a === void 0 ? void 0 : _a.id;
            if (Number.isNaN(Number(orderData.product_id)))
                return res.status(406).send({
                    message: 'please complete Order data',
                    orderData,
                });
            orderData = yield (0, utilites_1.formateOrder)(orderData, req.headers.authorization);
            if (Number.isNaN(Number(orderData.amount)))
                return res.status(406).send({
                    message: 'amount must be integer',
                    num: orderData,
                    req: req.body,
                });
            orderData.amount = Math.floor(Number(orderData.amount));
            orderData.product_id = Math.floor(Number(orderData.product_id));
            orderData.user_id = Math.floor(Number(orderData.user_id));
            orderData.status = 'active';
            const Order = yield orders_1.OrdersModel.insert(orderData);
            yield orders_1.OrdersModel.addProduct(Order.id, orderData);
            return res.status(200).json({
                msg: 'Order was addition completed successfully',
                Order,
            });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.create = create;
function remove(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            if (!Order)
                return res.status(404).json({ message: 'Order does not exist' });
            yield orders_1.OrdersModel.remove(Number(req.params.id));
            yield orders_1.OrdersModel.removeProducts(Number(req.params.id));
            return res.status(200).json({
                msg: 'deleted',
            });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.remove = remove;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            if (!order)
                return res.status(404).json({ message: 'Order does not exist' });
            let orderData = req.body;
            orderData.amount = Math.floor(Number(orderData.amount));
            orderData.product_id = Math.floor(Number(orderData.product_id));
            orderData = yield (0, utilites_1.formateOrder)(orderData, req.headers.authorization);
            const Order = yield orders_1.OrdersModel.update(orderData, parseInt(req.params.id));
            let result;
            if (orderData.product_id) {
                result = yield orders_1.OrdersModel.addProduct(parseInt(req.params.id), orderData);
                Order.products = [result];
            }
            return res.status(200).json({
                msg: 'updated',
                Order,
            });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.update = update;
function updateOrderProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            if (!order)
                return res.status(404).json({ message: 'Order does not exist' });
            let orderData = req.body;
            orderData.amount = Math.floor(Number(orderData.amount));
            orderData.product_id = Math.floor(Number(orderData.product_id));
            orderData = yield (0, utilites_1.formateOrder)(orderData, req.headers.authorization);
            const Order = yield orders_1.OrdersModel.update(orderData, parseInt(req.params.id));
            return res.status(200).json({
                msg: 'updated',
                Order,
            });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.updateOrderProduct = updateOrderProduct;
function removeOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            if (!order)
                return res.status(404).json({ message: 'Order does not exist' });
            const Order = yield orders_1.OrdersModel.removeProduct(parseInt(req.params.id));
            return res.status(200).json({
                msg: 'updated',
                Order,
            });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.removeOrder = removeOrder;
