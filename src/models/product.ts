import { ProductDTO, Product } from '../types/types';
import { DBConnection } from '../config/database/database';
import { generateProductUpdataSQL, getMonthPeriod } from '../utilites/utilites';
export { ProductModel };
class ProductModel {
    static async selectAll(): Promise<Product[]> {
        const conn = await DBConnection.connect();
        const sql =
            'SELECT SUM(order_products.quantity) AS num_of_orders,* FROM products INNER JOIN ((order_products ' +
            'INNER JOIN orders ON orders.id=order_products.order_id ) ' +
            'ON order_products.product_id=products.id  GROUP BY orders.id) WHERE' +
            ' orders.date_of_creation BETWEEN' +
            getMonthPeriod() +
            'ORDER BY  num_of_orders';
        const result = await conn.query<Product>(sql);
        conn.release();
        return result.rows;
    }
    static async select(id: number): Promise<Product> {
        const conn = await DBConnection.connect();
        const sql = 'SELECT * FROM products WHERE id=$1';
        const result = await conn.query<Product>(sql, [id]);
        conn.release();
        return result.rows[0];
    }
    static async insert(product: ProductDTO): Promise<Product> {
        const conn = await DBConnection.connect();
        const sql =
            'INSERT INTO products (name,price,amount,date_of_change,img_url) ' +
            'VALUES ($1,$2,$3,$4,$5) RETURNING *';
        const result = await conn.query<Product>(sql, [
            product.name,
            product.price,
            product.amount,
            product.date_of_change,
            product.img_url,
        ]);
        conn.release();
        return result.rows[0];
    }
    static async remove(id: number): Promise<Product> {
        const conn = await DBConnection.connect();
        const sql = 'DELETE FROM products WHERE id=$1 RETURNING *';
        const result = await conn.query<Product>(sql, [id]);
        conn.release();
        return result.rows[0];
    }
    static async update(product: ProductDTO, id: number): Promise<Product> {
        const conn = await DBConnection.connect();
        const sql = generateProductUpdataSQL(product);
        const result = await conn.query<Product>(sql.sql, [
            id,
            ...sql.theArray,
        ]);

        conn.release();
        return result.rows[0];
    }
}
