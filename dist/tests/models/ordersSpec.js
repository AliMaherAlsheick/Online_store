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
const orders_1 = require("../../models/orders");
const user_1 = require("../../models/user");
const product_1 = require("../../models/product");
console.log('testing order models environment' + process.env.ENVIRONMENT);
let user;
let product;
const orderData = {
    status: 'ongoing',
    order_address: '15 freedom str boston usa',
    delivery_cost: 50,
    quantity: 10,
    date: new Date().toDateString(),
};
let order;
describe('Tests for order model', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        user = yield user_1.UserModel.insert({
            first_name: 'meromoro',
            last_name: 'mondom',
            date_of_creation: 'Fri Dec 13 1996',
            email: 'mando@example.com',
            user_name: 'meromoromondom',
            user_password: '123456abcd',
            phone: '0111111111',
            user_type: 'guest',
        });
        orderData.user_id = user.id;
        product = yield product_1.ProductModel.insert({
            name: 'chicken',
            price: 10,
            amount: 100,
            date_of_change: new Date().toDateString(),
            img_url: 'http://server.img.png',
            category: 'food',
        });
        orderData.product_id = product.id;
    }));
    it('expects the order to have  the same data in orderData', () => __awaiter(void 0, void 0, void 0, function* () {
        order = yield orders_1.OrdersModel.insert(orderData);
        expect(Object.assign(Object.assign({}, order), { date_of_creation: new Date(order.date_of_creation).toDateString() })).toEqual({
            id: 1,
            user_id: user.id,
            status: 'ongoing',
            delivery_cost: 50,
            date_of_creation: new Date().toDateString(),
            order_address: '15 freedom str boston usa',
        });
    }));
    it('expects orderid to be number greater than 0', () => {
        expect(order.id).toEqual(1);
    });
    it('expect the response to be the same as {...order,num_of_orders:0}', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield orders_1.OrdersModel.select(order.id);
        expect(Object.assign(Object.assign({}, response), { date_of_creation: new Date(response.date_of_creation).toDateString() })).toEqual({
            id: 1,
            user_id: user.id,
            status: 'ongoing',
            delivery_cost: 50,
            date_of_creation: new Date().toDateString(),
            order_address: '15 freedom str boston usa',
            products_cost: 0,
            total_cost: 0,
            products: [],
        });
    }));
    it('expects the responce to be array containing {...order,num_of_orders:0} as last element', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield orders_1.OrdersModel.selectAll();
        expect(Object.assign(Object.assign({}, response[response.length - 1]), { date_of_creation: new Date(response[response.length - 1].date_of_creation).toDateString() })).toEqual({
            id: 1,
            user_id: user.id,
            status: 'ongoing',
            delivery_cost: 50,
            date_of_creation: new Date().toDateString(),
            order_address: '15 freedom str boston usa',
            products_cost: 0,
            total_cost: 0,
        });
    }));
    it('expect the response to be the array contains {...order,num_of_orders:0}', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield orders_1.OrdersModel.addProduct(order.id, orderData);
        expect(response).toEqual({
            id: 1,
            order_id: order.id,
            product_id: product.id,
            quantity: orderData.quantity,
        });
    }));
    it('expects to the response to be orderafter updating property' + ' email', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield orders_1.OrdersModel.update({ delivery_cost: 60 }, order.id);
        expect(Object.assign(Object.assign({}, response), { date_of_creation: new Date(response.date_of_creation).toDateString() })).toEqual({
            id: 1,
            status: 'ongoing',
            user_id: 1,
            date_of_creation: new Date().toDateString(),
            order_address: '15 freedom str boston usa',
            delivery_cost: 60,
        });
    }));
    it('expects the result to be user orders', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield orders_1.OrdersModel.userOrders(user.id);
        expect(response).toEqual([
            Object.assign(Object.assign({}, order), { total_cost: 160, delivery_cost: 60, products_cost: 100, products: [
                    {
                        id: 1,
                        order_id: order.id,
                        product_id: product.id,
                        quantity: orderData.quantity,
                        product_name: product.name,
                        product_price: product.price,
                    },
                ] }),
        ]);
    }));
    it('expects response to be {id: 1,order_id: order.id,product_id: product.id,quantity: 20,product_name: product.name,product_price: product.price,}', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield orders_1.OrdersModel.updateOrderProduct({ quantity: 20 }, 1);
        expect(response).toEqual({
            id: 1,
            order_id: order.id,
            product_id: product.id,
            quantity: 20,
        });
    }));
    it('expects the response to be {id: 1,order_id: order.id,product_id: product.id,quantity: 20,product_name: product.name,product_price: product.price,}', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield orders_1.OrdersModel.selectOrderP(1);
        expect(response).toEqual({
            id: 1,
            order_id: order.id,
            product_id: product.id,
            quantity: 20,
            product_name: product.name,
            product_price: product.price,
        });
    }));
    it('expects the response to be [{id: 1,order_id: order.id,product_id: product.id,quantity: 20,product_name: product.name,product_price: product.price,}]', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield orders_1.OrdersModel.selectOrderPs(order.id);
        expect(response).toEqual([
            {
                id: 1,
                order_id: order.id,
                product_id: product.id,
                quantity: 20,
                product_name: product.name,
                product_price: product.price,
            },
        ]);
    }));
    it('expects  the response to be falsey', () => __awaiter(void 0, void 0, void 0, function* () {
        yield orders_1.OrdersModel.removeProduct(1);
        const response = yield orders_1.OrdersModel.selectOrderP(1);
        expect(response).toBeFalsy();
    }));
    it('expects  the response to be empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield orders_1.OrdersModel.addProduct(order.id, orderData);
        yield orders_1.OrdersModel.removeProducts(order.id);
        const response = yield orders_1.OrdersModel.selectOrderPs(order.id);
        expect(response).toEqual([]);
    }));
    it('expects the response to be falsy', () => __awaiter(void 0, void 0, void 0, function* () {
        yield orders_1.OrdersModel.remove(order.id);
        const response = yield orders_1.OrdersModel.select(order.id);
        expect(response).toBeFalsy();
    }));
});
