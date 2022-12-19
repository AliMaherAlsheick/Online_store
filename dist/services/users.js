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
            const caller = yield (0, utilites_1.Verfy)(req.headers.authorization);
            console.log(caller);
            const user = yield user_1.UserModel.select(parseInt(req.params.id));
            user.user_password = '********';
            let result;
            if (!(user === null || user === void 0 ? void 0 : user.id))
                return res.status(404).json({ message: "user does n't exist" });
            if ((caller === null || caller === void 0 ? void 0 : caller.user_type) === 'admin' || (user === null || user === void 0 ? void 0 : user.id) === (caller === null || caller === void 0 ? void 0 : caller.id)) {
                result = { msg: 'ok', result: user };
                return res.status(200).json({ message: 'show', user });
            }
            else
                return res.status(400).json({
                    message: 'not allowed',
                });
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
            let user = req.body;
            let caller = yield (0, utilites_1.Verfy)(req.headers.authorization);
            if ((caller === null || caller === void 0 ? void 0 : caller.user_type) === 'admin') {
                deleting(user, yield user_1.UserModel.select(parseInt(req.params.id)));
            }
            else {
                if ((caller === null || caller === void 0 ? void 0 : caller.id) === parseInt(req.params.id) &&
                    (yield (0, utilites_1.passwordValidation)(user.user_password, caller.user_password))) {
                    deleting(user, caller);
                }
                else
                    return res.status(404).json({ message: 'not allowed' });
            }
            function deleting(userData, user) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (user === null || user === void 0 ? void 0 : user.id) {
                        yield user_1.UserModel.remove(parseInt(req.params.id));
                        return res.status(200).json({
                            msg: 'deleted',
                        });
                    }
                    return res.status(404).json({ message: 'user does not exist' });
                });
            }
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
            let user = req.body;
            let caller = yield (0, utilites_1.Verfy)(req.headers.authorization);
            if ((caller === null || caller === void 0 ? void 0 : caller.user_type) === 'admin') {
                updating(user, yield user_1.UserModel.select(parseInt(req.params.id)));
            }
            else {
                if ((caller === null || caller === void 0 ? void 0 : caller.id) === parseInt(req.params.id) &&
                    (yield (0, utilites_1.passwordValidation)(user.user_password, caller.user_password))) {
                    updating(user, caller);
                }
                else
                    return res.status(404).json({ message: 'not allowed' });
            }
            function updating(userData, user) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (user === null || user === void 0 ? void 0 : user.id) {
                        if (userData.hasOwnProperty('new_password')) {
                            const validate = (0, utilites_1.passwordConstrainsCheck)(userData.new_password);
                            if (!validate.valid) {
                                return res.status(404).json({ message: validate.msg });
                            }
                            else {
                                userData.user_password = yield (0, utilites_1.hashPassword)(userData.new_password);
                            }
                            delete userData.new_password;
                        }
                        else {
                            delete userData.user_password;
                        }
                        if (userData === null || userData === void 0 ? void 0 : userData.user_name) {
                            if ((userData === null || userData === void 0 ? void 0 : userData.user_name) !== (user === null || user === void 0 ? void 0 : user.user_name)) {
                                const validate = yield (0, utilites_1.userNameConstrainsCheck)(userData);
                                if (!validate.valid)
                                    return res
                                        .status(404)
                                        .json({ message: validate.msg });
                            }
                            else
                                delete userData.user_name;
                        }
                        user = yield user_1.UserModel.update(userData, parseInt(req.params.id));
                        userData.user_password = '********';
                        return res.status(200).json({
                            msg: 'updated',
                            user,
                        });
                    }
                    return res.status(404).json({ message: 'user does not exist' });
                });
            }
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
                const jwt = (0, utilites_1.getJWT)(user === null || user === void 0 ? void 0 : user.id);
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
