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
exports.adminCheck = exports.userCheck = void 0;
require("dotenv/config");
const user_1 = require("../models/user");
const utilites_1 = require("../utilites/utilites");
function userCheck(req, res, NextFunction) {
    try {
        (0, utilites_1.Verfy)(req.headers.authorization);
        NextFunction();
    }
    catch (error) {
        res.status(400).json({
            message: 'invalid token please signIn or signUp',
            error,
        });
    }
}
exports.userCheck = userCheck;
function adminCheck(req, res, NextFunction) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.UserModel.select((_a = (0, utilites_1.Verfy)(req.headers.authorization)) === null || _a === void 0 ? void 0 : _a.id);
            if (user.user_type === 'admin')
                NextFunction();
            else
                return res.status(400).json({
                    message: 'only admin is allower to perform this action',
                });
        }
        catch (error) {
            return res.status(400).json({
                message: 'invalid token please signIn or signUp',
                error,
            });
        }
    });
}
exports.adminCheck = adminCheck;
