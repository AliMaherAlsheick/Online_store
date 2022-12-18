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
exports.getMonthPeriod = exports.Verfy = exports.formateOrder = exports.generateProductUpdataSQL = exports.formateProduct = exports.generateUpdataSQL = exports.checkUserExistance = exports.passwordValidation = exports.getJWT = exports.formateNewUser = exports.userNameConstrainsCheck = exports.passwordConstrainsCheck = void 0;
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
    });
}
exports.userNameConstrainsCheck = userNameConstrainsCheck;
function formateNewUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        userData.date_of_creation =
            today.getFullYear() +
                '-' +
                (today.getMonth() + 1) +
                '-' +
                today.getDate();
        const salt = parseInt(process.env.STORE_SALT);
        const piper = process.env.STORE_PIPER;
        userData.user_password = yield bcrypt_1.default.hash(userData.user_password + piper, salt);
        return userData;
    });
}
exports.formateNewUser = formateNewUser;
function getJWT(id) {
    const jwtSecretToken = process.env.STORE_JWT_TOKEN;
    return jsonwebtoken_1.default.sign({ id }, jwtSecretToken);
}
exports.getJWT = getJWT;
function passwordValidation(password, dbpassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const piper = process.env.STORE_PIPER;
        const result = yield bcrypt_1.default.compare(password + piper, dbpassword);
        return result;
    });
}
exports.passwordValidation = passwordValidation;
function checkUserExistance(id, user_password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.UserModel.select(id);
        if (!(user === null || user === void 0 ? void 0 : user.user_password))
            return { valid: false, msg: 'invalid user name' };
        const result = yield passwordValidation(user_password, user.user_password);
        if (result) {
            return {
                valid: true,
                msg: 'done',
            };
        }
        return { valid: false, msg: 'wrong password' };
    });
}
exports.checkUserExistance = checkUserExistance;
function generateUpdataSQL(user, id) {
    let sql = 'UPDATE users SET ';
    let n = 1;
    const coloums = [];
    const theArray = [];
    const entries = Object.entries(user);
    for (let entry of entries) {
        coloums.push((entry[0] += '=$' + ++n));
        theArray.push(entry[1]);
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
        today.getFullYear() +
            '-' +
            (today.getMonth() + 1) +
            '-' +
            today.getDate();
    return productData;
}
exports.formateProduct = formateProduct;
function generateProductUpdataSQL(product) {
    let sql = 'UPDATE products SET ';
    let n = 1;
    const coloums = [];
    const theArray = [];
    const entries = Object.entries(product);
    for (let entry of entries) {
        coloums.push((entry[0] += '=$' + ++n));
        theArray.push(entry[1]);
    }
    sql += coloums.join(',') + ' WHERE id=$1 RETURNING *';
    return { sql, theArray };
}
exports.generateProductUpdataSQL = generateProductUpdataSQL;
function formateOrder(orderData, authorization) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const JWT = (_a = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1]) !== null && _a !== void 0 ? _a : '';
            const today = new Date();
            orderData.date =
                today.getFullYear() +
                    '-' +
                    (today.getMonth() + 1) +
                    '-' +
                    today.getDate();
            orderData.user_id = (_b = jsonwebtoken_1.default.verify(JWT, process.env.STORE_JWT_TOKEN)) === null || _b === void 0 ? void 0 : _b.id;
        }
        catch (error) { }
        return orderData;
    });
}
exports.formateOrder = formateOrder;
function Verfy(authorization) {
    var _a;
    const JWT = (_a = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1]) !== null && _a !== void 0 ? _a : '';
    return jsonwebtoken_1.default.verify(JWT, process.env.STORE_JWT_TOKEN);
}
exports.Verfy = Verfy;
function getMonthPeriod() {
    const today = new Date();
    const todayDate = today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
    const lastM = new Date();
    lastM.setMonth(lastM.getMonth() - 1);
    const lastMD = lastM.getFullYear() +
        '-' +
        (lastM.getMonth() + 1) +
        '-' +
        lastM.getDate();
    return todayDate + ' AND ' + lastMD + ';';
}
exports.getMonthPeriod = getMonthPeriod;
