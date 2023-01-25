import { ProductModel } from '../../models/product';
import { Product, ProductDTO } from '../../types/types';
console.log('testing product models environment' + process.env.ENVIRONMENT);
const productData: ProductDTO = {
    name: 'fish',
    price: 50,
    amount: 100,
    date_of_change: new Date().toDateString(),
    img_url: 'http://server.img.png',
    category: 'food',
};
let product: Product;
describe('Tests for product model', () => {
    it('expects the productto have  the same data in productData', async () => {
        product = await ProductModel.insert(productData);
        const response: {
            id?: number;
            name: string;
            price: number;
            amount: number;
            date_of_change: string;
            img_url: string;
            category: string;
            rating: number;
        } = { ...product };
        delete response.id;
        expect({
            ...response,
            date_of_change: new Date(response.date_of_change).toDateString(),
        }).toEqual({
            name: 'fish',
            price: 50,
            amount: 100,
            date_of_change: new Date().toDateString(),
            img_url: 'http://server.img.png',
            category: 'food',
            rating: 0,
        });
    });
    it('expects productid to be number greater than 0', () => {
        expect(product.id).toBeGreaterThan(0);
    });
    it('expect the response to be the same as {...product,num_of_orders:0}', async () => {
        const response = await ProductModel.select(product.id);
        expect(response).toEqual({ ...product, num_of_orders: 0 });
    });
    it('expects the responce to be array containing {...product,num_of_orders:0} as last element', async () => {
        const response = await ProductModel.selectAll();
        expect(response[response.length - 1]).toEqual({
            ...product,
            num_of_orders: 0,
        });
    });
    it('expect the response to be the array contains {...product,num_of_orders:0}', async () => {
        const response = await ProductModel.find('name=$1', [product.name]);
        expect(response).toEqual([{ ...product, num_of_orders: 0 }]);
    });
    it(
        'expects to the response to be productafter updating property' +
            ' email',
        async () => {
            const response = await ProductModel.update(
                { ...productData, img_url: './img.png' },
                product.id
            );
            expect(response).toEqual({ ...product, img_url: './img.png' });
        }
    );
    it('expects to the response to be empty', async () => {
        await ProductModel.remove(product.id);
        const response = await ProductModel.select(product.id);
        expect(response).toBeFalsy();
    });
});
