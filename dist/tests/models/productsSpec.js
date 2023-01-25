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
const product_1 = require("../../models/product");
console.log('testing product models environment' + process.env.ENVIRONMENT);
const productData = {
    name: 'fish',
    price: 50,
    amount: 100,
    date_of_change: new Date().toDateString(),
    img_url: 'http://server.img.png',
    category: 'food',
};
let product;
describe('Tests for product model', () => {
    it('expects the productto have  the same data in productData', () => __awaiter(void 0, void 0, void 0, function* () {
        product = yield product_1.ProductModel.insert(productData);
        const response = Object.assign({}, product);
        delete response.id;
        expect(Object.assign(Object.assign({}, response), { date_of_change: new Date(response.date_of_change).toDateString() })).toEqual({
            name: 'fish',
            price: 50,
            amount: 100,
            date_of_change: new Date().toDateString(),
            img_url: 'http://server.img.png',
            category: 'food',
            rating: 0,
        });
    }));
    it('expects productid to be number greater than 0', () => {
        expect(product.id).toBeGreaterThan(0);
    });
    it('expect the response to be the same as {...product,num_of_orders:0}', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield product_1.ProductModel.select(product.id);
        expect(response).toEqual(Object.assign(Object.assign({}, product), { num_of_orders: 0 }));
    }));
    it('expects the responce to be array containing {...product,num_of_orders:0} as last element', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield product_1.ProductModel.selectAll();
        expect(response[response.length - 1]).toEqual(Object.assign(Object.assign({}, product), { num_of_orders: 0 }));
    }));
    it('expect the response to be the array contains {...product,num_of_orders:0}', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield product_1.ProductModel.find('name=$1', [product.name]);
        expect(response).toEqual([Object.assign(Object.assign({}, product), { num_of_orders: 0 })]);
    }));
    it('expects to the response to be productafter updating property' +
        ' email', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield product_1.ProductModel.update(Object.assign(Object.assign({}, productData), { img_url: './img.png' }), product.id);
        expect(response).toEqual(Object.assign(Object.assign({}, product), { img_url: './img.png' }));
    }));
    it('expects to the response to be empty', () => __awaiter(void 0, void 0, void 0, function* () {
        yield product_1.ProductModel.remove(product.id);
        const response = yield product_1.ProductModel.select(product.id);
        expect(response).toBeFalsy();
    }));
});
