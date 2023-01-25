import supertest from 'supertest';
import { app } from '../server';
console.log('testing');
const AppRequest = supertest(app);
describe('Test endpoint responses', () => {
    it('gets the api endpoint', async () => {
        const response = await AppRequest.get('/user');
        expect(response.status).toBe(200);
    });
});
