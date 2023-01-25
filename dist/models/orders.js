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
exports.OrdersModel = void 0;
const database_1 = require("../config/database/database");
const utilites_1 = require("../utilites/utilites");
class OrdersModel {
    static selectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT orders.* ,COALESCE(SUM(order_products.quantity*products.price),0) AS products_cost ' +
                    ',COALESCE((SUM(order_products.quantity*products.price)+orders.delivery_cost),0)AS total_cost' +
                    ' FROM( orders LEFT JOIN( order_products INNER JOIN products ON ' +
                    'order_products.product_id=products.id)' +
                    'ON orders.id=order_products.order_id ) GROUP BY orders.id ORDER BY orders.id';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static select(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT orders.* ,COALESCE(SUM(order_products.quantity*products.price),0) AS products_cost ' +
                    ',COALESCE((SUM(order_products.quantity*products.price)+orders.delivery_cost),0)AS total_cost' +
                    ' FROM( orders LEFT JOIN( order_products INNER JOIN products ON ' +
                    'order_products.product_id=products.id)' +
                    'ON orders.id=order_products.order_id ) WHERE orders.id=$1 GROUP BY orders.id ORDER BY orders.id';
                const result = yield conn.query(sql, [id]);
                if ((_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.id)
                    result.rows[0].products = yield this.selectOrderPs(result.rows[0].id);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                console.log(error);
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static userOrders(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT orders.* ,COALESCE(SUM(order_products.quantity*products.price),0) AS products_cost ' +
                    ',COALESCE((SUM(order_products.quantity*products.price)+orders.delivery_cost),0)AS total_cost' +
                    ' FROM( orders LEFT JOIN( order_products INNER JOIN products ON ' +
                    'order_products.product_id=products.id)' +
                    'ON orders.id=order_products.order_id ) WHERE orders.user_id=$1  GROUP BY orders.id ORDER BY orders.id';
                const result = yield conn.query(sql, [id]);
                result.rows[0].products = yield this.selectOrderPs(result.rows[0].id);
                conn.release();
                return result.rows;
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static insert(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'INSERT INTO orders(user_id,date_of_creation,status,order_address,delivery_cost) VALUES ($1,$2,$3,$4,$5) returning *';
                const result = yield conn.query(sql, [
                    order.user_id,
                    order.date,
                    order.status,
                    order.order_address,
                    order.delivery_cost,
                ]);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                console.log(error);
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'DELETE FROM orders WHERE id=$1 RETURNING *';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static addProduct(id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                let sql = ' INSERT INTO order_products (quantity,order_id,product_id) VALUES($1,$2,$3) RETURNING *';
                let result = yield conn.query(sql, [
                    order.quantity,
                    id,
                    order.product_id,
                ]);
                return result.rows[0];
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static removeProducts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                let sql = 'DELETE FROM order_products  WHERE order_id=$1 ';
                yield conn.query(sql, [id]);
                conn.release();
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static removeProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                let sql = 'DELETE FROM order_products  WHERE id=$1 ';
                yield conn.query(sql, [id]);
                conn.release();
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static update(order, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = (0, utilites_1.generateOrderUpdataSQL)(order);
                const result = yield conn.query(sql.sql, [
                    id,
                    ...sql.theArray,
                ]);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                console.log(error);
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static updateOrderProduct(order, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = (0, utilites_1.generateOrderPUpdataSQL)(order);
                console.log(sql.sql, [id, ...sql.theArray]);
                const result = yield conn.query(sql.sql, [
                    id,
                    ...sql.theArray,
                ]);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static selectOrderPs(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT  order_products.* ,products.name AS product_name ,products.price AS product_price ' +
                    ' FROM order_products' +
                    ' INNER JOIN products ON order_products.product_id=products.id   WHERE order_id=$1';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows;
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static selectOrderP(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT order_products.*,products.name AS product_name ,products.price AS product_price' +
                    ' FROM order_products' +
                    ' INNER JOIN products ON order_products.product_id=products.id  WHERE order_products.id=$1';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
}
exports.OrdersModel = OrdersModel;
