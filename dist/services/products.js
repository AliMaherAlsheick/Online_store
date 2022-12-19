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
exports.update = exports.remove = exports.create = exports.show = exports.index = void 0;
const product_1 = require("../models/product");
const utilites_1 = require("../utilites/utilites");
function index(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield product_1.ProductModel.selectAll();
            res.send({ message: 'ok', products });
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
            const product = yield product_1.ProductModel.select(parseInt(req.params.id));
            if (!(product === null || product === void 0 ? void 0 : product.id))
                return res.status(404).json({ message: "product does n't exist" });
            return res.status(200).json({ message: 'show', product });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.show = show;
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let productData = req.body;
            if (!(productData.amount &&
                productData.name &&
                productData.price &&
                productData.img_url &&
                productData.category))
                return res.status(406).send({
                    message: 'please complete product data',
                });
            productData = (0, utilites_1.formateProduct)(productData);
            if (Number.isNaN(productData.price))
                return res.status(406).send({
                    message: 'price must be number',
                });
            if (Number.isNaN(productData.amount))
                return res.status(406).send({
                    message: 'amount must be integer',
                });
            productData.amount = Math.floor(productData.amount);
            const product = yield product_1.ProductModel.insert(productData);
            return res.status(200).json({
                msg: 'product was addition completed successfully',
                product,
            });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.create = create;
function remove(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Product = yield product_1.ProductModel.select(parseInt(req.params.id));
            if (!(Product === null || Product === void 0 ? void 0 : Product.id))
                return res.status(404).json({ message: 'product does not exist' });
            yield product_1.ProductModel.remove(Number(req.params.id));
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
            const Product = yield product_1.ProductModel.select(parseInt(req.params.id));
            if (!(Product === null || Product === void 0 ? void 0 : Product.id))
                return res.status(404).json({ message: 'product does not exist' });
            let productData = req.body;
            productData = (0, utilites_1.formateProduct)(productData);
            if (Number.isNaN(productData.price))
                return res.status(406).send({
                    message: 'price must be number',
                });
            if (Number.isNaN(productData.amount))
                return res.status(406).send({
                    message: 'amount must be integer',
                });
            productData.amount = Math.floor(productData.amount);
            const product = yield product_1.ProductModel.update(productData, parseInt(req.params.id));
            return res.status(200).json({
                msg: 'updated',
                product,
            });
        }
        catch (error) {
            return res.status(500).send({ message: 'error encountered', error });
        }
    });
}
exports.update = update;
