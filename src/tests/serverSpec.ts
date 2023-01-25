import supertest from 'supertest';
import { app } from '../server';
const AppRequest = supertest(app);
describe('Test endpoints responses', () => {
    it('test the user api endpoint', async () => {
        const response = await AppRequest.get('/user');
        expect(response.status).toBe(400);
    });
    it('test the product api endpoint', async () => {
        const response = await AppRequest.get('/product');
        expect(response.status).toBe(200);
    });
    it('test the api endpoint', async () => {
        const response = await AppRequest.get('/order');
        expect(response.status).toBe(400);
    });
});
