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
exports.UserModel = void 0;
const database_1 = require("../config/database/database");
const utilites_1 = require("../utilites/utilites");
class UserModel {
    static selectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT * FROM users';
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
                const sql = 'SELECT * FROM users WHERE id=$1';
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
    static selectUser(user_name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'SELECT * FROM users WHERE user_name=$1';
                const result = yield conn.query(sql, [user_name]);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static insert(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = 'INSERT INTO users (first_name ,last_name ,date_of_creation,email ,user_name,user_password,phone,user_type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) returning *';
                const result = yield conn.query(sql, [
                    user.first_name,
                    user.last_name,
                    user.date_of_creation,
                    user.email,
                    user.user_name,
                    user.user_password,
                    user.phone,
                    user.user_type,
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
                const sql = 'DELETE FROM users WHERE id=$1 ';
                const result = yield conn.query(sql, [id]);
                conn.release();
                return;
            }
            catch (error) {
                const err = new Error('error in your data ' + error.message);
                throw err;
            }
        });
    }
    static update(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.DBConnection.connect();
                const sql = (0, utilites_1.generateUpdataSQL)(user);
                console.log(sql[0], [id, ...sql[1]]);
                const result = yield conn.query(sql[0], [id, ...sql[1]]);
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
exports.UserModel = UserModel;
