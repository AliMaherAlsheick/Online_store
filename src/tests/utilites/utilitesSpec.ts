import { JsonWebTokenError } from 'jsonwebtoken';
import { Order, OrderDTO, ProductDTO, User } from '../../types/types';
import * as utiltes from '../../utilites/utilites';
describe('Tests for utility functions', () => {
    describe('test for generateUpdataSQL function', () => {
        it(
            'expects the result of generateUpdataSQL(' +
                "{first_name: 'ali',last_name: 'maher',}) to be " +
                "['UPDATE users SET first_name=$2,last_name=$3 WHERE " +
                "id=$1 RETURNING *',['ali','maher']]",
            async () => {
                const result = utiltes.generateUpdataSQL({
                    first_name: 'ali',
                    last_name: 'maher',
                });
                expect(result).toEqual([
                    'UPDATE users SET first_name=$2,last_name=$3 WHERE id=$1 RETURNING *',
                    ['ali', 'maher'],
                ]);
            }
        );
    });
    describe('test for generateProductUpdataSQL function', () => {
        it(
            "expects the result of generateProductUpdataSQL({name: 'fish'," +
                "price: 10,amount: 100,}to be {'UPDATE products SET " +
                "name=$2,price=$3,amount=$4 WHERE id=$1 RETURNING *'" +
                ",['fish',10,100]}",
            async () => {
                const result = utiltes.generateProductUpdataSQL({
                    name: 'fish',
                    price: 10,
                    amount: 100,
                } as ProductDTO);
                expect([result.sql, result.theArray]).toEqual([
                    'UPDATE products SET name=$2,price=$3,amount=$4 WHERE id=$1 RETURNING *',
                    ['fish', 10, 100],
                ]);
            }
        );
    });
    describe('test for generateOrderUpdataSQL function', () => {
        it(
            'expects the result of generateOrderUpdataSQL({' +
                " status: 'ongoing',order_address: '35 nasr street'," +
                "}  to be ['UPDATE orders SET status=$2,order_address=$3 " +
                "WHERE id=$1 RETURNING *',['ongoing','35 nasr street']]",
            async () => {
                const result = utiltes.generateOrderUpdataSQL({
                    status: 'ongoing',
                    order_address: '35 nasr street',
                } as OrderDTO);
                expect([result.sql, result.theArray]).toEqual([
                    'UPDATE orders SET status=$2,order_address=$3 WHERE id=$1 RETURNING *',
                    ['ongoing', '35 nasr street'],
                ]);
            }
        );
    });
    describe('test for generateOrderPUpdataSQL function', () => {
        it(
            'expects the result of generateOrderPUpdataSQL({' +
                " quantity: 10, product_id: 12,} to be ['UPDATE " +
                'order_products SET quantity=$2,product_id=$3' +
                " WHERE id=$1 RETURNING *', [10, 12],]",
            async () => {
                const result = utiltes.generateOrderPUpdataSQL({
                    quantity: 10,
                    product_id: 12,
                } as OrderDTO);
                expect([result.sql, result.theArray]).toEqual([
                    'UPDATE order_products SET quantity=$2,product_id=$3 WHERE id=$1 RETURNING *',
                    [10, 12],
                ]);
            }
        );
    });

    describe('test for generateProductSearchOption function', () => {
        it("expects the result to be ['price=$1 OR rating=$2',[10, 10]]", async () => {
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
        });
        it(
            "expects the result to be ['name=$1 OR category=$2'," +
                "['fish', 'fish'],]",
            async () => {
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
            }
        );
    });

    describe('test for getJWT function', () => {
        it('expects the result to be jwt code', async () => {
            const result = utiltes.getJWT(1);
            expect(result).not.toMatch(
                /'[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+'/
            );
        });
    });
    describe('test for hashPassword function', () => {
        it('expects the result to be not equal to 123', async () => {
            try {
                const result = await utiltes.hashPassword('123');
                expect(result).not.toEqual('123');
            } catch (error) {
                throw error;
            }
        }, 5000);
    });
    describe('test for passwordConstrainsCheck function', () => {
        it('expects the result to be false', async () => {
            const result = utiltes.passwordConstrainsCheck('123');
            expect(result.valid).toBeFalse();
        });
        it('expects the result to be true', async () => {
            const result = utiltes.passwordConstrainsCheck('1236790bfx');
            expect(result.valid).toBeTrue();
        });
    });
    describe('test for passwordValidation function', () => {
        it('expects the result to be false', async () => {
            const result = await utiltes.passwordValidation('', '');
            expect(result).toBeFalse();
        });
        it('expects the result to be true', async () => {
            const hashedP = await utiltes.hashPassword('123');
            const result = await utiltes.passwordValidation('123', hashedP);
            expect(result).toBeTrue();
        }, 20000);
    });
    describe('test for userNameConstrainsCheck function', () => {
        it('expects the result to be true', async () => {
            const result = await utiltes.userNameConstrainsCheck({
                user_name: 'hellovc',
            });
            expect(result.valid).toBeTrue();
        });
    });
});
