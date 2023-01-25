import { UserModel } from '../../models/user';
import { User, UserDTO } from '../../types/types';
console.log('testing models environment' + process.env.ENVIRONMENT);
const UserData: UserDTO = {
    first_name: 'mero',
    last_name: 'mondo',
    date_of_creation: '12-13-1996',
    email: 'mando@example.com',
    user_name: 'meromando',
    user_password: '123456abcd',
    phone: '0111111111',
    user_type: 'guest',
};
let user: User = {
    id: 1,
    first_name: 'mero',
    last_name: 'mondo',
    date_of_creation: '12-13-1996',
    email: 'mando@example.com',
    user_name: 'meromando',
    user_password: '123456abcd',
    phone: '0111111111',
    user_type: 'guest',
};
describe('Tests for user model', () => {
    it('expects the user to have  the same data in UserData', async () => {
        user = await UserModel.insert(UserData);
        const response: {
            id?: number;
            first_name: string;
            last_name: string;
            date_of_creation: string;
            email: string;
            user_name: string;
            user_password: string;
            phone: string;
            user_type: string;
        } = { ...user };
        delete response.id;
        expect(response).toEqual({
            first_name: 'mero',
            last_name: 'mondo',
            date_of_creation: '12-13-1996',
            email: 'mando@example.com',
            user_name: 'meromando',
            user_password: '123456abcd',
            phone: '0111111111',
            user_type: 'guest',
        });
    });
    it('expects user id to be number greater than 0', () => {
        expect(user.id).toBeGreaterThan(0);
    });
    it('expect the response to be the same as user', async () => {
        const response = await UserModel.select(1);
        expect(response).toEqual(user);
    });
    it('expects the responce to be array containing user as last element', async () => {
        const response = await UserModel.selectAll();
        expect(response[response.length - 1]).toEqual(user);
    });
    it('expect the response to be the same as user', async () => {
        const response = await UserModel.selectUser(user.user_name);
        expect(response).toEqual(user);
    });
    it(
        'expects to the response to be user after updating property' + ' email',
        async () => {
            const response = await UserModel.update(
                { ...UserData, email: 'mero2@eampample.com' },
                user.id
            );
            expect(response).toEqual({ ...user, email: 'mero2@eampample.com' });
        }
    );
    it('expects to the response to be empty', async () => {
        await UserModel.remove(user.id);
        const response = await UserModel.select(user.id);
        expect(response).toBeFalsy();
    });
});
