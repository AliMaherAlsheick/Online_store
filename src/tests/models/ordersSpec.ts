import { OrdersModel } from '../../models/orders';
import { UserModel } from '../../models/user';
import { ProductModel } from '../../models/product';
import {
    Order,
    OrderDTO,
    orders_product,
    Product,
    User,
} from '../../types/types';
console.log('testing order models environment' + process.env.ENVIRONMENT);
let user: User;
let product: Product;
const orderData: OrderDTO = {
    status: 'ongoing',
    order_address: '15 freedom str boston usa',
    delivery_cost: 50,
    quantity: 10,
    date: new Date().toDateString(),
};
let order: Order;
describe('Tests for order model', () => {
    beforeAll(async () => {
        user = await UserModel.insert({
            first_name: 'meromoro',
            last_name: 'mondom',
            date_of_creation: 'Fri Dec 13 1996',
            email: 'mando@example.com',
            user_name: 'meromoromondom',
            user_password: '123456abcd',
            phone: '0111111111',
            user_type: 'guest',
        });
        orderData.user_id = user.id;
        product = await ProductModel.insert({
            name: 'chicken',
            price: 10,
            amount: 100,
            date_of_change: new Date().toDateString(),
            img_url: 'http://server.img.png',
            category: 'food',
        });
        orderData.product_id = product.id;
    });
    it('expects the order to have  the same data in orderData', async () => {
        order = await OrdersModel.insert(orderData);

        expect({
            ...order,
            date_of_creation: new Date(order.date_of_creation).toDateString(),
        }).toEqual({
            id: 1,
            user_id: user.id,
            status: 'ongoing',
            delivery_cost: 50,
            date_of_creation: new Date().toDateString(),
            order_address: '15 freedom str boston usa',
        } as unknown as Order);
    });
    it('expects orderid to be number greater than 0', () => {
        expect(order.id).toEqual(1);
    });
    it('expect the response to be the same as {...order,num_of_orders:0}', async () => {
        const response = await OrdersModel.select(order.id);
        expect({
            ...response,
            date_of_creation: new Date(
                response.date_of_creation
            ).toDateString(),
        }).toEqual({
            id: 1,
            user_id: user.id,
            status: 'ongoing',
            delivery_cost: 50,
            date_of_creation: new Date().toDateString(),
            order_address: '15 freedom str boston usa',
            products_cost: 0,
            total_cost: 0,
            products: [],
        } as unknown as Order);
    });
    it('expects the responce to be array containing {...order,num_of_orders:0} as last element', async () => {
        const response = await OrdersModel.selectAll();
        expect({
            ...response[response.length - 1],
            date_of_creation: new Date(
                response[response.length - 1].date_of_creation
            ).toDateString(),
        }).toEqual({
            id: 1,
            user_id: user.id,
            status: 'ongoing',
            delivery_cost: 50,
            date_of_creation: new Date().toDateString(),
            order_address: '15 freedom str boston usa',
            products_cost: 0,
            total_cost: 0,
        } as unknown as Order);
    });
    it('expect the response to be the array contains {...order,num_of_orders:0}', async () => {
        const response = await OrdersModel.addProduct(order.id, orderData);
        expect(response).toEqual({
            id: 1,
            order_id: order.id,
            product_id: product.id,
            quantity: orderData.quantity as number,
        } as orders_product);
    });
    it(
        'expects to the response to be orderafter updating property' + ' email',
        async () => {
            const response = await OrdersModel.update(
                { delivery_cost: 60 },
                order.id
            );
            expect({
                ...response,
                date_of_creation: new Date(
                    response.date_of_creation
                ).toDateString(),
            }).toEqual({
                id: 1,
                status: 'ongoing',
                user_id: 1,
                date_of_creation: new Date().toDateString(),
                order_address: '15 freedom str boston usa',
                delivery_cost: 60,
            } as Order);
        }
    );
    it('expects the result to be user orders', async () => {
        const response = await OrdersModel.userOrders(user.id);

        expect(response).toEqual([
            {
                ...order,
                total_cost: 160,
                delivery_cost: 60,
                products_cost: 100,
                products: [
                    {
                        id: 1,
                        order_id: order.id,
                        product_id: product.id,
                        quantity: orderData.quantity as number,
                        product_name: product.name,
                        product_price: product.price,
                    },
                ],
            },
        ]);
    });
    it('expects response to be {id: 1,order_id: order.id,product_id: product.id,quantity: 20,product_name: product.name,product_price: product.price,}', async () => {
        const response = await OrdersModel.updateOrderProduct(
            { quantity: 20 },
            1
        );
        expect(response).toEqual({
            id: 1,
            order_id: order.id,
            product_id: product.id,
            quantity: 20,
        } as orders_product);
    });

    it('expects the response to be {id: 1,order_id: order.id,product_id: product.id,quantity: 20,product_name: product.name,product_price: product.price,}', async () => {
        const response = await OrdersModel.selectOrderP(1);
        expect(response).toEqual({
            id: 1,
            order_id: order.id,
            product_id: product.id,
            quantity: 20,
            product_name: product.name,
            product_price: product.price,
        });
    });
    it('expects the response to be [{id: 1,order_id: order.id,product_id: product.id,quantity: 20,product_name: product.name,product_price: product.price,}]', async () => {
        const response = await OrdersModel.selectOrderPs(order.id);
        expect(response).toEqual([
            {
                id: 1,
                order_id: order.id,
                product_id: product.id,
                quantity: 20,
                product_name: product.name,
                product_price: product.price,
            },
        ]);
    });
    it('expects  the response to be falsey', async () => {
        await OrdersModel.removeProduct(1);
        const response = await OrdersModel.selectOrderP(1);
        expect(response).toBeFalsy();
    });
    it('expects  the response to be empty array', async () => {
        await OrdersModel.addProduct(order.id, orderData);
        await OrdersModel.removeProducts(order.id);
        const response = await OrdersModel.selectOrderPs(order.id);
        expect(response).toEqual([]);
    });
    it('expects the response to be falsy', async () => {
        await OrdersModel.remove(order.id);
        const response = await OrdersModel.select(order.id);
        expect(response).toBeFalsy();
    });
});
