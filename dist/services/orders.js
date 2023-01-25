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
exports.addOrderProduct = exports.updateOrderPpoducts = exports.showUser = exports.update = exports.remove = exports.create = exports.show = exports.index = void 0;
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
                    msg: 'ok',
                    result: yield orders_1.OrdersModel.userOrders(user.id),
                };
            }
            res.send({ message: result.msg, result: result.result });
        }
        catch (error) {
            res.status(500).send({
                message: 'error encountered',
                error: error.message,
            });
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
            return res
                .status(500)
                .send({
                message: 'error encountered',
                error: error.message,
            });
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
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orderData = (0, utilites_1.formateOrder)(req.body);
            orderData.user_id = (_a = (yield (0, utilites_1.Verfy)(req.headers.authorization))) === null || _a === void 0 ? void 0 : _a.id;
            orderData.status = 'active';
            if (!(orderData === null || orderData === void 0 ? void 0 : orderData.quantity) ||
                !(orderData === null || orderData === void 0 ? void 0 : orderData.product_id) ||
                !((_b = (yield product_1.ProductModel.select(orderData === null || orderData === void 0 ? void 0 : orderData.product_id))) === null || _b === void 0 ? void 0 : _b.id) ||
                !(orderData === null || orderData === void 0 ? void 0 : orderData.order_address))
                return res.status(406).send({
                    message: 'please complete Order data: product_id ,quantity and ' +
                        'order_address are required , product id must be vaid product_id and quantity must be number',
                    orderData,
                    body: req.body,
                });
            const Order = yield orders_1.OrdersModel.insert(orderData);
            yield orders_1.OrdersModel.addProduct(Order.id, orderData);
            return res.status(200).json({
                msg: 'Order was addition completed successfully',
                Order,
            });
        }
        catch (error) {
            return res
                .status(500)
                .send({
                message: 'error encountered',
                error: error.message,
            });
        }
    });
}
exports.create = create;
function remove(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, utilites_1.Verfy)(req.headers.authorization);
            //if(Number.isNaN(parseInt(req.params.id)))return res.status(400).json({ message: 'you must ass valid ' });
            const order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            if (!(order === null || order === void 0 ? void 0 : order.id))
                return res.status(404).json({ message: "Order does n't exist" });
            if ((user === null || user === void 0 ? void 0 : user.user_type) !== 'admin' && (user === null || user === void 0 ? void 0 : user.id) !== (order === null || order === void 0 ? void 0 : order.user_id))
                return res.status(400).json({ message: 'not allowed' });
            yield orders_1.OrdersModel.removeProducts(Number(req.params.id));
            yield orders_1.OrdersModel.remove(Number(req.params.id));
            return res.status(200).json({
                msg: 'deleted',
            });
        }
        catch (error) {
            return res
                .status(500)
                .send({
                message: 'error encountered',
                error: error.message,
            });
        }
    });
}
exports.remove = remove;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, utilites_1.Verfy)(req.headers.authorization);
            const order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            let orderData = (0, utilites_1.formateOrder)(req.body);
            if (!(order === null || order === void 0 ? void 0 : order.id))
                return res.status(404).json({ message: "Order does n't exist" });
            if ((user === null || user === void 0 ? void 0 : user.user_type) === 'admin') {
            }
            else if ((user === null || user === void 0 ? void 0 : user.id) === (order === null || order === void 0 ? void 0 : order.user_id)) {
                if (orderData.hasOwnProperty('status'))
                    delete orderData.status;
                if (orderData.hasOwnProperty('user_id'))
                    delete orderData.user_id;
            }
            else
                return res.status(400).json({ message: 'not allowed' });
            if (!(orderData.status ||
                orderData.order_address ||
                orderData.delivery_cost ||
                orderData.user_id))
                return res.status(200).json({
                    msg: 'add properites to update',
                });
            const Order = yield orders_1.OrdersModel.update(orderData, parseInt(req.params.id));
            return res.status(200).json({
                msg: 'updated',
                Order,
            });
        }
        catch (error) {
            return res
                .status(500)
                .send({
                message: 'error encountered',
                error: error.message,
            });
        }
    });
}
exports.update = update;
function addOrderProduct(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order_productData = req.body;
            order_productData.amount = parseInt('' + order_productData.amount);
            order_productData.product_id = parseInt('' + order_productData.product_id);
            let order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            if ((order === null || order === void 0 ? void 0 : order.user_id) !== ((_a = (yield (0, utilites_1.Verfy)(req.headers.authorization))) === null || _a === void 0 ? void 0 : _a.id))
                return res.status(406).send({
                    message: 'not allowed ',
                    order_productData,
                });
            if (!(order === null || order === void 0 ? void 0 : order.id))
                return res.status(406).send({
                    message: 'order does not exist ',
                    order_productData,
                });
            if (!(order_productData === null || order_productData === void 0 ? void 0 : order_productData.amount) ||
                !(order_productData === null || order_productData === void 0 ? void 0 : order_productData.product_id) ||
                !((_b = (yield product_1.ProductModel.select(order_productData === null || order_productData === void 0 ? void 0 : order_productData.product_id))) === null || _b === void 0 ? void 0 : _b.id))
                return res.status(406).send({
                    message: 'please complete Order data: product_id ,amount and ' +
                        'order_address are required , product id must be vaid product_id and amount must be number',
                    order_productData,
                });
            yield orders_1.OrdersModel.addProduct(order.id, order_productData);
            order = yield orders_1.OrdersModel.select(parseInt(req.params.id));
            return res.status(200).json({
                msg: 'Order was addition completed successfully',
                order,
            });
        }
        catch (error) {
            return res
                .status(500)
                .send({
                message: 'error encountered',
                error: error.message,
            });
        }
    });
}
exports.addOrderProduct = addOrderProduct;
function updateOrderPpoducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, utilites_1.Verfy)(req.headers.authorization);
            const orderP = yield orders_1.OrdersModel.selectOrderP(parseInt(req.params.id));
            let order = yield orders_1.OrdersModel.select(orderP === null || orderP === void 0 ? void 0 : orderP.order_id);
            if (!(orderP === null || orderP === void 0 ? void 0 : orderP.id) || !(order === null || order === void 0 ? void 0 : order.id))
                return res.status(404).json({ message: "Order does n't exist" });
            if ((user === null || user === void 0 ? void 0 : user.user_type) !== 'admin' && (user === null || user === void 0 ? void 0 : user.id) !== (order === null || order === void 0 ? void 0 : order.user_id))
                return res.status(400).json({ message: 'not allowed' });
            const orderData = (0, utilites_1.formateOrder)(req.body);
            if ((orderData === null || orderData === void 0 ? void 0 : orderData.quantity) || (orderData === null || orderData === void 0 ? void 0 : orderData.product_id)) {
                const product = yield product_1.ProductModel.select(orderData.product_id);
                if (!(product === null || product === void 0 ? void 0 : product.id))
                    return res.status(404).json({
                        msg: 'product does not exist',
                    });
                const orderProduct = yield orders_1.OrdersModel.updateOrderProduct(orderData, parseInt(req.params.id));
                order = yield orders_1.OrdersModel.select(orderP.order_id);
                return res.status(200).json({
                    msg: 'updated',
                    order,
                    editedProduct: orderProduct,
                });
            }
            else {
                yield orders_1.OrdersModel.removeProduct(parseInt(req.params.id));
                order = yield orders_1.OrdersModel.select(orderP.order_id);
                return res.status(200).json({
                    msg: 'deleted',
                    order,
                });
            }
        }
        catch (error) {
            return res.status(500).send({
                message: 'error encountered',
                error: error.message,
            });
        }
    });
}
exports.updateOrderPpoducts = updateOrderPpoducts;
