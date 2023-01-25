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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
const AppRequest = (0, supertest_1.default)(server_1.app);
describe('Test endpoints responses', () => {
    it('test the user api endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield AppRequest.get('/user');
        expect(response.status).toBe(400);
    }));
    it('test the product api endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield AppRequest.get('/product');
        expect(response.status).toBe(200);
    }));
    it('test the api endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield AppRequest.get('/order');
        expect(response.status).toBe(400);
    }));
});
