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
exports.removeOrderProduct = exports.showUser = exports.update = exports.remove = exports.create = exports.show = exports.index = void 0;
const orders_1 = require("../models/orders");
const product_1 = require("../models/product");
const utilites_1 = require("../utilites/utilites");
function index(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, utilites_1.Verfy)(req.headers.authorization);
            let result;
            if ((user === null || user === void 0 ? void 0 : user.user_type) === 'admin') {
                result = { msg: 'ok', result: yield orders_1.OrdersModel.selectAll() };
            }
            else {
                const reslt = yield showUser(user.id);
                result = {
                    msg: reslt instanceof Error ? 'error encountered' : 'ok',
                    result: reslt instanceof Error ? reslt.message : reslt,
                };
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
            const user = yield (0, utilites_1.Verfy)(req.headers.authorization);
            let result;
            const order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            if (!(order === null || order === void 0 ? void 0 : order.id))
                return res.status(404).json({ message: "Order does n't exist" });
            if ((user === null || user === void 0 ? void 0 : user.user_type) === 'admin') {
                result = { msg: 'ok', result: order };
            }
            else if ((user === null || user === void 0 ? void 0 : user.id) === (order === null || order === void 0 ? void 0 : order.user_id)) {
                result = { msg: 'ok', result: order };
            }
            else
                return res.status(400).json({ message: 'not allowed' });
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
                return [];
            return orders;
        }
        catch (error) {
            return new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.showUser = showUser;
function create(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orderData = (0, utilites_1.formateOrder)(req.body);
            orderData.user_id = (_a = (yield (0, utilites_1.Verfy)(req.headers.authorization))) === null || _a === void 0 ? void 0 : _a.id;
            orderData.status = 'active';
            if (!(orderData === null || orderData === void 0 ? void 0 : orderData.amount) ||
                !(orderData === null || orderData === void 0 ? void 0 : orderData.product_id) ||
                !(yield product_1.ProductModel.select(orderData === null || orderData === void 0 ? void 0 : orderData.product_id)).id ||
                !(orderData === null || orderData === void 0 ? void 0 : orderData.order_address))
                return res.status(406).send({
                    message: 'please complete Order data: product_id ,amount and ' +
                        'order_address are required , product id must be vaid product_id and amount must be number',
                    orderData,
                });
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
            const user = yield (0, utilites_1.Verfy)(req.headers.authorization);
            const order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            if (!(order === null || order === void 0 ? void 0 : order.id))
                return res.status(404).json({ message: "Order does n't exist" });
            if ((user === null || user === void 0 ? void 0 : user.user_type) !== 'admin' && (user === null || user === void 0 ? void 0 : user.id) !== (order === null || order === void 0 ? void 0 : order.user_id))
                return res.status(400).json({ message: 'not allowed' });
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
            const user = yield (0, utilites_1.Verfy)(req.headers.authorization);
            const order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            let orderData = yield (0, utilites_1.formateOrder)(req.body);
            if (!(order === null || order === void 0 ? void 0 : order.id))
                return res.status(404).json({ message: "Order does n't exist" });
            if ((user === null || user === void 0 ? void 0 : user.user_type) === 'admin') {
            }
            else if ((user === null || user === void 0 ? void 0 : user.id) === (order === null || order === void 0 ? void 0 : order.user_id)) {
            }
            else
                return res.status(400).json({ message: 'not allowed' });
            const Order = yield orders_1.OrdersModel.update(orderData, parseInt(req.params.id));
            if (orderData === null || orderData === void 0 ? void 0 : orderData.product_id) {
                Order.products = [
                    yield orders_1.OrdersModel.updateOrderProduct(orderData, orderData.product_id),
                ];
            }
            else {
                Order.products = [
                    yield orders_1.OrdersModel.addProduct(parseInt(req.params.id), orderData),
                ];
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
function removeOrderProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, utilites_1.Verfy)(req.headers.authorization);
            const order = yield orders_1.OrdersModel.select(parseInt(req.body.order_id));
            if (!(order === null || order === void 0 ? void 0 : order.id))
                return res.status(404).json({ message: "Order does n't exist" });
            if ((user === null || user === void 0 ? void 0 : user.user_type) !== 'admin' && (user === null || user === void 0 ? void 0 : user.id) !== (order === null || order === void 0 ? void 0 : order.user_id))
                return res.status(400).json({ message: 'not allowed' });
            const orderP = yield orders_1.OrdersModel.selectOrderP(parseInt(req.params.id));
            if (!(orderP === null || orderP === void 0 ? void 0 : orderP.id))
                return res
                    .status(404)
                    .json({ message: 'Order_product does not exist' });
            const Order = yield orders_1.OrdersModel.removeProduct(parseInt(req.params.id));
            return res.status(200).json({
                msg: 'deleted',
                Order,
            });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.removeOrderProduct = removeOrderProduct;
