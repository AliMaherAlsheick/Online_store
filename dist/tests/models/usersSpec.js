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
const user_1 = require("../../models/user");
console.log('testing user models environment' + process.env.ENVIRONMENT);
const UserData = {
    first_name: 'mero',
    last_name: 'mondo',
    date_of_creation: 'Fri Dec 13 1996',
    email: 'mando@example.com',
    user_name: 'meromando',
    user_password: '123456abcd',
    phone: '0111111111',
    user_type: 'guest',
};
let user = {
    id: 1,
    first_name: 'mero',
    last_name: 'mondo',
    date_of_creation: 'Fri Dec 13 1996',
    email: 'mando@example.com',
    user_name: 'meromando',
    user_password: '123456abcd',
    phone: '0111111111',
    user_type: 'guest',
};
describe('Tests for user model', () => {
    it('expects the user to have  the same data in UserData', () => __awaiter(void 0, void 0, void 0, function* () {
        user = yield user_1.UserModel.insert(UserData);
        const response = Object.assign({}, user);
        delete response.id;
        expect(Object.assign(Object.assign({}, response), { date_of_creation: new Date(response.date_of_creation).toDateString() })).toEqual({
            first_name: 'mero',
            last_name: 'mondo',
            date_of_creation: new Date('Fri Dec 13 1996 00:00:00 GMT-0800 (Pacific Standard Time)').toDateString(),
            email: 'mando@example.com',
            user_name: 'meromando',
            user_password: '123456abcd',
            phone: '0111111111',
            user_type: 'guest',
        });
    }));
    it('expects user id to be number greater than 0', () => {
        expect(user.id).toBeGreaterThan(0);
    });
    it('expect the response to be the same as user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield user_1.UserModel.select(user.id);
        expect(response).toEqual(user);
    }));
    it('expects the responce to be array containing user as last element', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield user_1.UserModel.selectAll();
        expect(response[response.length - 1]).toEqual(user);
    }));
    it('expect the response to be the same as user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield user_1.UserModel.selectUser(user.user_name);
        expect(response).toEqual(user);
    }));
    it('expects to the response to be user after updating property' + ' email', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield user_1.UserModel.update(Object.assign(Object.assign({}, UserData), { email: 'mero2@eampample.com' }), user.id);
        expect(response).toEqual(Object.assign(Object.assign({}, user), { email: 'mero2@eampample.com' }));
    }));
    it('expects to the response to be empty', () => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.UserModel.remove(user.id);
        const response = yield user_1.UserModel.select(user.id);
        expect(response).toBeFalsy();
    }));
});
