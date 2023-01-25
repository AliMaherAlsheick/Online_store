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
exports.ProductModel = void 0;
const database_1 = require("../config/database/database");
const utilites_1 = require("../utilites/utilites");
class ProductModel {
    static selectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT COALESCE(SUM(order_products.quantity),0)AS num_of_orders,  products.* ' +
                    'FROM( products  LEFT JOIN (order_products  ' +
                    'INNER JOIN orders ON orders.id=order_products.order_id AND orders.date_of_creation BETWEEN ' +
                    (0, utilites_1.getMonthPeriod)() +
                    ' ) ON order_products.product_id=products.id) GROUP BY products.id ORDER BY num_of_orders DESC,products.category,products.id ;';
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT COALESCE(SUM(order_products.quantity),0) AS num_of_orders,  products.* ' +
                    'FROM( products  LEFT JOIN (order_products  ' +
                    'INNER JOIN orders ON orders.id=order_products.order_id AND orders.date_of_creation BETWEEN ' +
                    (0, utilites_1.getMonthPeriod)() +
                    ' ) ON order_products.product_id=products.id) WHERE products.id=$1 GROUP BY products.id ORDER BY num_of_orders DESC,' +
                    'products.category,products.id ;';
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
    static insert(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'INSERT INTO products (name,price,amount,date_of_change,img_url,category) ' +
                    'VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
                const result = yield conn.query(sql, [
                    product.name,
                    product.price,
                    product.amount,
                    product.date_of_change,
                    product.img_url,
                    product.category,
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
    static remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'DELETE FROM products WHERE id=$1 RETURNING *';
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
    static update(product, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = (0, utilites_1.generateProductUpdataSQL)(product);
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
    static find(option, values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT COALESCE(SUM(order_products.quantity),0) AS num_of_orders,  products.* ' +
                    'FROM( products  LEFT JOIN (order_products  ' +
                    'INNER JOIN orders ON orders.id=order_products.order_id AND orders.date_of_creation BETWEEN ' +
                    (0, utilites_1.getMonthPeriod)() +
                    ' ) ON order_products.product_id=products.id) WHERE ' +
                    option +
                    ' GROUP BY products.id ORDER BY num_of_orders DESC,' +
                    'products.category,products.id ';
                console.log(sql, values);
                const result = yield conn.query(sql, values);
                conn.release();
                return result.rows;
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
}
exports.ProductModel = ProductModel;
