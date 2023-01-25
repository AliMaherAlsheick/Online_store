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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProductSerchOption = exports.generateOrderPUpdataSQL = exports.hashPassword = exports.getMonthPeriod = exports.Verfy = exports.formateOrder = exports.generateOrderUpdataSQL = exports.generateProductUpdataSQL = exports.formateProduct = exports.generateUpdataSQL = exports.passwordValidation = exports.getJWT = exports.formateNewUser = exports.userNameConstrainsCheck = exports.passwordConstrainsCheck = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function passwordConstrainsCheck(password) {
    if (password.length < 8)
        return {
            valid: false,
            msg: 'password must be eight characters or more ',
        };
    return {
        valid: true,
        msg: 'ok',
    };
}
exports.passwordConstrainsCheck = passwordConstrainsCheck;
function userNameConstrainsCheck(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Usr = yield user_1.UserModel.selectUser(user.user_name);
            if (Usr === null || Usr === void 0 ? void 0 : Usr.user_password)
                return {
                    valid: false,
                    msg: 'username already in use',
                };
            return {
                valid: true,
                msg: 'ok',
            };
        }
        catch (err) {
            throw err;
        }
    });
}
exports.userNameConstrainsCheck = userNameConstrainsCheck;
function formateNewUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const today = new Date();
            userData.date_of_creation =
                today.getMonth() +
                    1 +
                    '-' +
                    today.getDate() +
                    '-' +
                    today.getFullYear();
            userData.user_password = yield hashPassword(userData.user_password);
            return userData;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.formateNewUser = formateNewUser;
function getJWT(id) {
    return jsonwebtoken_1.default.sign({ id }, process.env.STORE_JWT_TOKEN);
}
exports.getJWT = getJWT;
function passwordValidation(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const piper = process.env.STORE_PIPER;
            const result = yield bcrypt_1.default.compare(password + piper, hashedPassword);
            return result;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.passwordValidation = passwordValidation;
function generateUpdataSQL(user) {
    let sql = 'UPDATE users SET ';
    let n = 1;
    const coloums = [];
    const theArray = [];
    const keys = [
        'first_name',
        'last_name',
        'date_of_creation',
        'email',
        'user_name',
        'user_password',
        'user_type',
        'phone',
    ];
    for (let key of keys) {
        if (user.hasOwnProperty(key)) {
            coloums.push(key + '=$' + ++n);
            theArray.push(user[key]);
        }
    }
    sql += coloums.join(',') + ' WHERE id=$1 RETURNING *';
    return [sql, theArray];
}
exports.generateUpdataSQL = generateUpdataSQL;
function formateProduct(productData) {
    productData.amount = Number(productData.amount);
    productData.amount = Number(productData.amount);
    const today = new Date();
    productData.date_of_change =
        today.getMonth() +
            1 +
            '-' +
            today.getDate() +
            '-' +
            today.getFullYear();
    return productData;
}
exports.formateProduct = formateProduct;
function generateProductUpdataSQL(product) {
    let sql = 'UPDATE products SET ';
    let n = 1;
    const coloums = [];
    const theArray = [];
    const keys = [
        'name',
        'price',
        'amount',
        'img_url',
        'rating',
        'date_of_change',
        'category',
    ];
    for (let key of keys) {
        if (product.hasOwnProperty(key)) {
            coloums.push(key + '=$' + ++n);
            theArray.push(product[key]);
        }
    }
    sql += coloums.join(',') + ' WHERE id=$1 RETURNING *';
    return { sql, theArray };
}
exports.generateProductUpdataSQL = generateProductUpdataSQL;
function generateOrderUpdataSQL(order) {
    let sql = 'UPDATE orders SET ';
    let n = 1;
    const coloums = [];
    const theArray = [];
    const keys = [
        'status',
        'order_address',
        'delivery_cost',
        'user_id',
    ];
    for (let key of keys) {
        if (order.hasOwnProperty(key)) {
            coloums.push(key + '=$' + ++n);
            theArray.push(order[key]);
        }
    }
    sql += coloums.join(',') + ' WHERE id=$1 RETURNING *';
    return { sql, theArray };
}
exports.generateOrderUpdataSQL = generateOrderUpdataSQL;
function formateOrder(orderData) {
    const today = new Date();
    orderData.date =
        today.getMonth() +
            1 +
            '-' +
            today.getDate() +
            '-' +
            today.getFullYear();
    orderData.quantity = parseInt('' + orderData.quantity);
    orderData.product_id = parseInt('' + orderData.product_id);
    return orderData;
}
exports.formateOrder = formateOrder;
function Verfy(authorization) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const JWT = (_a = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1]) !== null && _a !== void 0 ? _a : '';
            const user = user_1.UserModel.select((_b = jsonwebtoken_1.default.verify(JWT, process.env.STORE_JWT_TOKEN)) === null || _b === void 0 ? void 0 : _b.id);
            return user;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.Verfy = Verfy;
function getMonthPeriod() {
    const today = new Date();
    const todayDate = today.getMonth() +
        1 +
        '-' +
        today.getDate() +
        '-' +
        today.getFullYear();
    const lastM = new Date();
    lastM.setMonth(lastM.getMonth() - 1);
    const lastMD = lastM.getMonth() +
        1 +
        '-' +
        lastM.getDate() +
        '-' +
        lastM.getFullYear();
    return "'" + lastMD + "'" + ' AND ' + "'" + todayDate + "'";
}
exports.getMonthPeriod = getMonthPeriod;
function hashPassword(pass) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const salt = parseInt(process.env.STORE_SALT);
            const piper = process.env.STORE_PIPER;
            pass = yield bcrypt_1.default.hash(pass + piper, salt);
            return pass;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.hashPassword = hashPassword;
function generateOrderPUpdataSQL(order) {
    let sql = 'UPDATE order_products SET ';
    let n = 1;
    const coloums = [];
    const theArray = [];
    const keys = ['quantity', 'product_id'];
    for (let key of keys) {
        if (order.hasOwnProperty(key)) {
            coloums.push(key + '=$' + ++n);
            theArray.push(order[key]);
        }
    }
    sql += coloums.join(',') + ' WHERE id=$1 RETURNING *';
    return { sql, theArray };
}
exports.generateOrderPUpdataSQL = generateOrderPUpdataSQL;
function generateProductSerchOption(order) {
    let n = 0;
    let search_value;
    let keys;
    const search = [];
    const values = [];
    if (Number.isNaN(Number(order.search_value))) {
        search_value = (order.search_value + '').split(' ');
        keys = ['name', 'category'];
        for (let key of keys) {
            if (order.searchOptions[key]) {
                search.push(key + '=$' + ++n);
                values.push(search_value.join(' '));
                if (search_value.length > 1) {
                    for (let value of search_value) {
                        search.push(key + '=$' + ++n);
                        values.push(value);
                    }
                }
            }
        }
    }
    else {
        search_value = Number(order.search_value);
        keys = ['price', 'rating'];
        for (let key of keys) {
            if (order.searchOptions[key]) {
                search.push(key + '=$' + ++n);
                values.push(search_value);
            }
        }
    }
    return { search: search.join(' OR '), values };
}
exports.generateProductSerchOption = generateProductSerchOption;
