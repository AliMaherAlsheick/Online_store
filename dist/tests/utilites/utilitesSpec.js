"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const utiltes = __importStar(require("../../utilites/utilites"));
describe('Tests for utility functions', () => {
    describe('test for generateUpdataSQL function', () => {
        it('expects the result of generateUpdataSQL(' +
            "{first_name: 'ali',last_name: 'maher',}) to be " +
            "['UPDATE users SET first_name=$2,last_name=$3 WHERE " +
            "id=$1 RETURNING *',['ali','maher']]", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = utiltes.generateUpdataSQL({
                first_name: 'ali',
                last_name: 'maher',
            });
            expect(result).toEqual([
                'UPDATE users SET first_name=$2,last_name=$3 WHERE id=$1 RETURNING *',
                ['ali', 'maher'],
            ]);
        }));
    });
    describe('test for generateProductUpdataSQL function', () => {
        it("expects the result of generateProductUpdataSQL({name: 'fish'," +
            "price: 10,amount: 100,}to be {'UPDATE products SET " +
            "name=$2,price=$3,amount=$4 WHERE id=$1 RETURNING *'" +
            ",['fish',10,100]}", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = utiltes.generateProductUpdataSQL({
                name: 'fish',
                price: 10,
                amount: 100,
            });
            expect([result.sql, result.theArray]).toEqual([
                'UPDATE products SET name=$2,price=$3,amount=$4 WHERE id=$1 RETURNING *',
                ['fish', 10, 100],
            ]);
        }));
    });
    describe('test for generateOrderUpdataSQL function', () => {
        it('expects the result of generateOrderUpdataSQL({' +
            " status: 'ongoing',order_address: '35 nasr street'," +
            "}  to be ['UPDATE orders SET status=$2,order_address=$3 " +
            "WHERE id=$1 RETURNING *',['ongoing','35 nasr street']]", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = utiltes.generateOrderUpdataSQL({
                status: 'ongoing',
                order_address: '35 nasr street',
            });
            expect([result.sql, result.theArray]).toEqual([
                'UPDATE orders SET status=$2,order_address=$3 WHERE id=$1 RETURNING *',
                ['ongoing', '35 nasr street'],
            ]);
        }));
    });
    describe('test for generateOrderPUpdataSQL function', () => {
        it('expects the result of generateOrderPUpdataSQL({' +
            " quantity: 10, product_id: 12,} to be ['UPDATE " +
            'order_products SET quantity=$2,product_id=$3' +
            " WHERE id=$1 RETURNING *', [10, 12],]", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = utiltes.generateOrderPUpdataSQL({
                quantity: 10,
                product_id: 12,
            });
            expect([result.sql, result.theArray]).toEqual([
                'UPDATE order_products SET quantity=$2,product_id=$3 WHERE id=$1 RETURNING *',
                [10, 12],
            ]);
        }));
    });
    describe('test for generateProductSearchOption function', () => {
        it("expects the result to be ['price=$1 OR rating=$2',[10, 10]]", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = utiltes.generateProductSerchOption({
                search_value: '10',
                searchOptions: {
                    name: true,
                    price: true,
                    rating: true,
                    date_of_change: true,
                    category: true,
                },
            });
            expect([result.search, result.values]).toEqual([
                'price=$1 OR rating=$2',
                [10, 10],
            ]);
        }));
        it("expects the result to be ['name=$1 OR category=$2'," +
            "['fish', 'fish'],]", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = utiltes.generateProductSerchOption({
                search_value: 'fish',
                searchOptions: {
                    name: true,
                    price: true,
                    rating: true,
                    date_of_change: true,
                    category: true,
                },
            });
            expect([result.search, result.values]).toEqual([
                'name=$1 OR category=$2',
                ['fish', 'fish'],
            ]);
        }));
    });
    describe('test for getJWT function', () => {
        it('expects the result to be jwt code', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = utiltes.getJWT(1);
            expect(result).not.toMatch(/'[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+'/);
        }));
    });
    describe('test for hashPassword function', () => {
        it('expects the result to be not equal to 123', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const result = yield utiltes.hashPassword('123');
                expect(result).not.toEqual('123');
            }
            catch (error) {
                throw error;
            }
        }), 5000);
    });
    describe('test for passwordConstrainsCheck function', () => {
        it('expects the result to be false', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = utiltes.passwordConstrainsCheck('123');
            expect(result.valid).toBeFalse();
        }));
        it('expects the result to be true', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = utiltes.passwordConstrainsCheck('1236790bfx');
            expect(result.valid).toBeTrue();
        }));
    });
    describe('test for passwordValidation function', () => {
        it('expects the result to be false', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield utiltes.passwordValidation('', '');
            expect(result).toBeFalse();
        }));
        it('expects the result to be true', () => __awaiter(void 0, void 0, void 0, function* () {
            const hashedP = yield utiltes.hashPassword('123');
            const result = yield utiltes.passwordValidation('123', hashedP);
            expect(result).toBeTrue();
        }), 20000);
    });
    describe('test for userNameConstrainsCheck function', () => {
        it('expects the result to be true', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield utiltes.userNameConstrainsCheck({
                user_name: 'hellovc',
            });
            expect(result.valid).toBeTrue();
        }));
    });
});
