import { ProductDTO, Product } from '../types/types';
import { DBConnection } from '../config/database/database';
import { generateProductUpdataSQL, getMonthPeriod } from '../utilites/utilites';
export { ProductModel };
class ProductModel {
    static async selectAll(): Promise<Product[]> {
        try {
            const conn = await DBConnection.connect();
            const sql =
                'SELECT COALESCE(SUM(order_products.quantity),0)AS num_of_orders,  products.* ' +
                'FROM( products  LEFT JOIN (order_products  ' +
                'INNER JOIN orders ON orders.id=order_products.order_id AND orders.date_of_creation BETWEEN ' +
                getMonthPeriod() +
                ' ) ON order_products.product_id=products.id) GROUP BY products.id ORDER BY num_of_orders DESC,products.category,products.id ;';
            const result = await conn.query<Product>(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            const err = new Error(
                'error in your data ' + (error as Error).message
            );
            throw err;
        }
    }
    static async select(id: number): Promise<Product> {
        try {
            const conn = await DBConnection.connect();
            const sql =
                'SELECT COALESCE(SUM(order_products.quantity),0) AS num_of_orders,  products.* ' +
                'FROM( products  LEFT JOIN (order_products  ' +
                'INNER JOIN orders ON orders.id=order_products.order_id AND orders.date_of_creation BETWEEN ' +
                getMonthPeriod() +
                ' ) ON order_products.product_id=products.id) WHERE products.id=$1 GROUP BY products.id ORDER BY num_of_orders DESC,' +
                'products.category,products.id ;';
            const result = await conn.query<Product>(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            const err = new Error(
                'error in your data ' + (error as Error).message
            );
            throw err;
        }
    }
    static async insert(product: ProductDTO): Promise<Product> {
        try {
            const conn = await DBConnection.connect();
            const sql =
                'INSERT INTO products (name,price,amount,date_of_change,img_url,category) ' +
                'VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
            const result = await conn.query<Product>(sql, [
                product.name,
                product.price,
                product.amount,
                product.date_of_change,
                product.img_url,
                product.category,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            const err = new Error(
                'error in your data ' + (error as Error).message
            );
            throw err;
        }
    }
    static async remove(id: number): Promise<Product> {
        try {
            const conn = await DBConnection.connect();
            const sql = 'DELETE FROM products WHERE id=$1 RETURNING *';
            const result = await conn.query<Product>(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            const err = new Error(
                'error in your data ' + (error as Error).message
            );
            throw err;
        }
    }
    static async update(product: ProductDTO, id: number): Promise<Product> {
        try {
            const conn = await DBConnection.connect();
            const sql = generateProductUpdataSQL(product);
            const result = await conn.query<Product>(sql.sql, [
                id,
                ...sql.theArray,
            ]);

            conn.release();
            return result.rows[0];
        } catch (error) {
            const err = new Error(
                'error in your data ' + (error as Error).message
            );
            throw err;
        }
    }
    static async find(
        option: string,
        values: (string | Number)[]
    ): Promise<Product[]> {
        try {
            const conn = await DBConnection.connect();
            const sql =
                'SELECT COALESCE(SUM(order_products.quantity),0) AS num_of_orders,  products.* ' +
                'FROM( products  LEFT JOIN (order_products  ' +
                'INNER JOIN orders ON orders.id=order_products.order_id AND orders.date_of_creation BETWEEN ' +
                getMonthPeriod() +
                ' ) ON order_products.product_id=products.id) WHERE ' +
                option +
                ' GROUP BY products.id ORDER BY num_of_orders DESC,' +
                'products.category,products.id ';
            const result = await conn.query<Product>(sql, values);
            conn.release();
            return result.rows;
        } catch (error) {
            const err = new Error(
                'error in your data ' + (error as Error).message
            );
            throw err;
        }
    }
}
