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
class OrdersModel {
    static selectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT orders.* ,SUM(order_products.quantity*products.price) AS products_cost ' +
                    ',(SUM(order_products.quantity*products.price)+orders.delivery_cost)AS total_cost' +
                    ' FROM( orders LEFT JOIN( order_products INNER JOIN products ON ' +
                    'order_products.product_id=products.id)' +
                    'ON orders.id=order_products.order_id ) GROUP BY orders.id ORDER BY orders.id';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static select(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT orders.* ,SUM(order_products.quantity*products.price) AS products_cost ' +
                    ',(SUM(order_products.quantity*products.price)+orders.delivery_cost)AS total_cost' +
                    ' FROM( orders LEFT JOIN( order_products INNER JOIN products ON ' +
                    'order_products.product_id=products.id)' +
                    'ON orders.id=order_products.order_id ) WHERE orders.id=$1 GROUP BY orders.id ORDER BY orders.id';
                const result = yield conn.query(sql, [id]);
                result.rows[0].products = yield this.selectOrderPs(result.rows[0].id);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    static userOrders(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT orders.* ,SUM(order_products.quantity*products.price) AS products_cost ' +
                    ',(SUM(order_products.quantity*products.price)+orders.delivery_cost)AS total_cost' +
                    ' FROM( orders LEFT JOIN( order_products INNER JOIN products ON ' +
                    'order_products.product_id=products.id)' +
                    'ON orders.id=order_products.order_id ) WHERE orders.user_id=$1  GROUP BY orders.id ORDER BY orders.id';
                const result = yield conn.query(sql, [id]);
                result.rows[0].products = yield this.selectOrderPs(result.rows[0].id);
                conn.release();
                return result.rows;
            }
            catch (error) {
                throw error;
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
                throw error;
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
                throw error;
            }
        });
    }
    static addProduct(id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                console.log(typeof id, typeof order.product_id, typeof order.amount);
                let sql = ' INSERT INTO order_products (quantity,order_id,product_id) VALUES($1,$2,$3) RETURNING *';
                let result = yield conn.query(sql, [
                    order.amount,
                    id,
                    order.product_id,
                ]);
                return result.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    static removeProducts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                let sql = 'DELETE FROM order-products  WHERE order_id=$1 ';
                yield conn.query(sql, [id]);
                conn.release();
            }
            catch (error) {
                throw error;
            }
        });
    }
    static removeProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                let sql = 'DELETE FROM order-products  WHERE id=$1 ';
                yield conn.query(sql, [id]);
                conn.release();
            }
            catch (error) {
                throw error;
            }
        });
    }
    static update(order, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'UPDATE orders SET status=$2 ,order_address=$3,delivery_cost=$4 WHERE id=$1 RETURNING *';
                const result = yield conn.query(sql, [
                    id,
                    order.status,
                    order.order_address,
                    order.delivery_cost,
                ]);
                this.addProduct(id, order);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateOrderProduct(order, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'UPDATE order-products SET quantity=$2,product_id=$3  WHERE id=$1 RETURNING *';
                const result = yield conn.query(sql, [
                    id,
                    order.amount,
                    order.product_id,
                ]);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                throw error;
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
                throw error;
            }
        });
    }
    static selectOrderP(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT order_products.*,products.name AS product_name ,products.price AS product_price' +
                    ' FROM order_products' +
                    ' INNER JOIN products ON order_products.product_id=products.id  WHERE id=$1';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.OrdersModel = OrdersModel;
