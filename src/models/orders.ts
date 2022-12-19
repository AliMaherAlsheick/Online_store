import { OrderDTO, Order, ProductDTO, orders_product } from '../types/types';
import { DBConnection } from '../config/database/database';
export { OrdersModel };
class OrdersModel {
    static async selectAll(): Promise<Order[]> {
        try {
            const conn = await DBConnection.connect();

            const sql =
                'SELECT orders.* ,SUM(order_products.quantity*products.price) AS products_cost ' +
                ',(SUM(order_products.quantity*products.price)+orders.delivery_cost)AS total_cost' +
                ' FROM( orders LEFT JOIN( order_products INNER JOIN products ON ' +
                'order_products.product_id=products.id)' +
                'ON orders.id=order_products.order_id ) GROUP BY orders.id ORDER BY orders.id';
            const result = await conn.query<Order>(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    static async select(id: number): Promise<Order> {
        try {
            const conn = await DBConnection.connect();
            const sql =
                'SELECT orders.* ,SUM(order_products.quantity*products.price) AS products_cost ' +
                ',(SUM(order_products.quantity*products.price)+orders.delivery_cost)AS total_cost' +
                ' FROM( orders LEFT JOIN( order_products INNER JOIN products ON ' +
                'order_products.product_id=products.id)' +
                'ON orders.id=order_products.order_id ) WHERE orders.id=$1 GROUP BY orders.id ORDER BY orders.id';
            const result = await conn.query<Order>(sql, [id]);
            result.rows[0].products = await this.selectOrderPs(
                result.rows[0].id
            );
            conn.release();
            return result.rows[0];
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    static async userOrders(id: number): Promise<Order[]> {
        try {
            const conn = await DBConnection.connect();
            const sql =
                'SELECT orders.* ,SUM(order_products.quantity*products.price) AS products_cost ' +
                ',(SUM(order_products.quantity*products.price)+orders.delivery_cost)AS total_cost' +
                ' FROM( orders LEFT JOIN( order_products INNER JOIN products ON ' +
                'order_products.product_id=products.id)' +
                'ON orders.id=order_products.order_id ) WHERE orders.user_id=$1  GROUP BY orders.id ORDER BY orders.id';
            const result = await conn.query<Order>(sql, [id]);
            result.rows[0].products = await this.selectOrderPs(
                result.rows[0].id
            );
            conn.release();
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    static async insert(order: OrderDTO): Promise<Order> {
        try {
            const conn = await DBConnection.connect();

            const sql =
                'INSERT INTO orders(user_id,date_of_creation,status,order_address,delivery_cost) VALUES ($1,$2,$3,$4,$5) returning *';
            const result = await conn.query<Order>(sql, [
                order.user_id,
                order.date,
                order.status,
                order.order_address,
                order.delivery_cost,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    static async remove(id: number): Promise<Order> {
        try {
            const conn = await DBConnection.connect();
            const sql = 'DELETE FROM orders WHERE id=$1 RETURNING *';
            const result = await conn.query<Order>(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    static async addProduct(
        id: number,
        order: OrderDTO
    ): Promise<orders_product> {
        try {
            const conn = await DBConnection.connect();
            console.log(
                typeof id,
                typeof order.product_id,
                typeof order.amount
            );
            let sql =
                ' INSERT INTO order_products (quantity,order_id,product_id) VALUES($1,$2,$3) RETURNING *';
            let result = await conn.query<orders_product>(sql, [
                order.amount,
                id,
                order.product_id,
            ]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    static async removeProducts(id: number) {
        try {
            const conn = await DBConnection.connect();
            let sql = 'DELETE FROM order-products  WHERE order_id=$1 ';
            await conn.query(sql, [id]);
            conn.release();
        } catch (error) {
            throw error;
        }
    }
    static async removeProduct(id: number) {
        try {
            const conn = await DBConnection.connect();
            let sql = 'DELETE FROM order-products  WHERE id=$1 ';
            await conn.query(sql, [id]);
            conn.release();
        } catch (error) {
            throw error;
        }
    }
    static async update(order: OrderDTO, id: number) {
        try {
            const conn = await DBConnection.connect();
            const sql =
                'UPDATE orders SET status=$2 ,order_address=$3,delivery_cost=$4 WHERE id=$1 RETURNING *';
            const result = await conn.query<Order>(sql, [
                id,
                order.status,
                order.order_address,
                order.delivery_cost,
            ]);
            this.addProduct(id, order);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    static async updateOrderProduct(order: OrderDTO, id: number) {
        try {
            const conn = await DBConnection.connect();
            const sql =
                'UPDATE order-products SET quantity=$2,product_id=$3  WHERE id=$1 RETURNING *';
            const result = await conn.query<orders_product>(sql, [
                id,
                order.amount,
                order.product_id,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    static async selectOrderPs(id: number) {
        try {
            const conn = await DBConnection.connect();
            const sql =
                'SELECT  order_products.* ,products.name AS product_name ,products.price AS product_price ' +
                ' FROM order_products' +
                ' INNER JOIN products ON order_products.product_id=products.id   WHERE order_id=$1';
            const result = await conn.query<orders_product>(sql, [id]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    static async selectOrderP(id: number) {
        try {
            const conn = await DBConnection.connect();
            const sql =
                'SELECT order_products.*,products.name AS product_name ,products.price AS product_price' +
                ' FROM order_products' +
                ' INNER JOIN products ON order_products.product_id=products.id  WHERE id=$1';
            const result = await conn.query<orders_product>(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}
