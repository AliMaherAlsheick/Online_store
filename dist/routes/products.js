"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middelwares/authentication");
const products_1 = require("../services/products");
const productsRoutes = express_1.default.Router();
exports.productsRoutes = productsRoutes;
productsRoutes.post('/', authentication_1.adminCheck, products_1.create);
productsRoutes.get('/', products_1.index);
productsRoutes.get('/:id', products_1.show);
productsRoutes.delete('/:id', authentication_1.adminCheck, products_1.remove);
productsRoutes.patch('/:id', authentication_1.adminCheck, products_1.update);
