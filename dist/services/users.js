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
exports.logIn = exports.update = exports.remove = exports.signUp = exports.show = exports.index = void 0;
const user_1 = require("../models/user");
const utilites_1 = require("../utilites/utilites");
function index(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_1.UserModel.selectAll();
            res.send({ message: 'ok', users });
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
            const user = yield user_1.UserModel.select(parseInt(req.params.id));
            if (!user)
                return res.status(404).json({ message: "user does n't exist" });
            user.user_password = '********';
            return res.status(200).json({ message: 'show', user });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.show = show;
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userData = req.body;
            if (!(userData.first_name &&
                userData.last_name &&
                userData.user_name &&
                userData.user_password))
                return res.status(406).send({
                    message: 'please complete your data',
                });
            const checkPassword = (0, utilites_1.passwordConstrainsCheck)(userData.user_password);
            const checkuserName = yield (0, utilites_1.userNameConstrainsCheck)(userData);
            if (!checkPassword.valid)
                return res.status(406).send({
                    message: checkPassword.msg,
                });
            if (!checkuserName.valid)
                return res.status(406).send({
                    message: checkuserName.msg,
                });
            const passStars = new Array(userData.user_password.length)
                .fill('*')
                .join('');
            if (process.env.ADMIN === userData.user_name) {
                if (process.env.ADMIN_PASS === userData.user_password) {
                    userData.user_type = 'admin';
                }
                else {
                    return res.status(406).send({
                        message: 'user name already in use',
                    });
                }
            }
            else
                userData.user_type = 'guest';
            userData = yield (0, utilites_1.formateNewUser)(userData);
            const user = yield user_1.UserModel.insert(userData);
            const jwt = (0, utilites_1.getJWT)(user.id);
            return res.status(200).json({
                msg: 'signUp completed successfully',
                jwt,
                userName: user.user_name,
                password: passStars,
                id: user.id,
            });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.signUp = signUp;
function remove(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, utilites_1.checkUserExistance)(parseInt(req.params.id), req.body.user_password);
            if (!result.valid)
                return res.status(404).json({ message: result.msg });
            const user = yield user_1.UserModel.remove(parseInt(req.params.id));
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
            const result = yield (0, utilites_1.checkUserExistance)(parseInt(req.params.id), req.body.user_password);
            if (!result.valid)
                return res.status(404).json({ message: result.msg });
            const user = yield user_1.UserModel.update(req.body, parseInt(req.params.id));
            user.user_password = '********';
            return res.status(200).json({
                msg: 'updated',
                user,
            });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.update = update;
function logIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.UserModel.selectUser(req.body.user_name);
            if (!(user === null || user === void 0 ? void 0 : user.user_password))
                return res.status(406).json({ message: 'invalid user name' });
            const result = yield (0, utilites_1.passwordValidation)(req.body.user_password, user === null || user === void 0 ? void 0 : user.user_password);
            if (result) {
                const jwt = (0, utilites_1.getJWT)(parseInt(req.params.id));
                return res.status(200).json({
                    msg: 'done',
                    id: user.id,
                    jwt,
                });
            }
            return res.status(406).json({ message: 'wrong password' });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.logIn = logIn;
