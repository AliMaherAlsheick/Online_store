import { OrderDTO, Order, ProductDTO, orders_product } from '../types/types';
import { DBConnection } from '../config/database/database';
export { OrdersModel };
class OrdersModel {
    static async selectAll(): Promise<Order[]> {
        const conn = await DBConnection.connect();
        const sql =
            'SELECT * ,SUM(order_products.quantity*products.price) AS products_cost ' +
            ',(products_cost+orders.delivery_cost)AS total_cost' +
            ' FROM( orders INNER JOIN( order_products INNER JOIN products ON ' +
            'order_products.product_id=product.id)' +
            'ON product.id=order_products.order_id )';
        const result = await conn.query<Order>(sql);
        conn.release();
        return result.rows;
    }
    static async select(id: number): Promise<Order> {
        const conn = await DBConnection.connect();
        const sql =
            'SELECT * ,SUM(order_products.quantity*products.price) AS products_cost ' +
            ',(products_cost+orders.delivery_cost)AS total_cost' +
            ' FROM( orders INNER JOIN( order_products INNER JOIN products ON ' +
            'order_products.product_id=product.id)' +
            'ON product.id=order_products.order_id ) WHERE orders.id=$1';
        const result = await conn.query<Order>(sql, [id]);
        result.rows[0].products = await this.selectOrderPs(result.rows[0].id);
        conn.release();
        return result.rows[0];
    }
    static async userOrders(id: number): Promise<Order[]> {
        const conn = await DBConnection.connect();
        const sql =
            'SELECT * ,SUM(order_products.quantity*products.price) AS products_cost ' +
            ',(products_cost+orders.delivery_cost)AS total_cost' +
            ' FROM( orders INNER JOIN( order_products INNER JOIN products ON ' +
            'order_products.product_id=product.id)' +
            'ON product.id=order_products.order_id ) WHERE orders.user_id=$1';
        const result = await conn.query<Order>(sql, [id]);
        result.rows[0].products = await this.selectOrderPs(result.rows[0].id);
        conn.release();
        return result.rows;
    }
    static async insert(order: OrderDTO): Promise<Order> {
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
    }
    static async remove(id: number): Promise<Order> {
        const conn = await DBConnection.connect();
        const sql = 'DELETE FROM orders WHERE id=$1 RETURNING *';
        const result = await conn.query<Order>(sql, [id]);
        conn.release();
        return result.rows[0];
    }
    static async addProduct(
        id: number,
        order: OrderDTO
    ): Promise<orders_product> {
        const conn = await DBConnection.connect();
        console.log(typeof id, typeof order.product_id, typeof order.amount);
        let sql =
            ' INSERT INTO order_products (quantity,order_id,product_id) VALUES($1,$2,$3) RETURNING *';
        let result = await conn.query<orders_product>(sql, [
            order.amount,
            id,
            order.product_id,
        ]);
        return result.rows[0];
    }
    static async removeProducts(id: number) {
        const conn = await DBConnection.connect();
        let sql = 'DELETE FROM order-products  WHERE ptoduct_id=$1 ';
        await conn.query(sql, [id]);
        conn.release();
    }
    static async removeProduct(id: number) {
        const conn = await DBConnection.connect();
        let sql = 'DELETE FROM order-products  WHERE id=$1 ';
        await conn.query(sql, [id]);
        conn.release();
    }
    static async update(order: OrderDTO, id: number) {
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
    }
    static async updateOrderProduct(order: OrderDTO, id: number) {
        const conn = await DBConnection.connect();
        const sql =
            'UPDATE order-products SET quantity=$2,product_id=$3  WHERE id=$1 RETURNING *';
        const result = await conn.query<Order>(sql, [
            id,
            order.amount,
            order.product_id,
        ]);
        conn.release();
        return result.rows[0];
    }
    static async selectOrderPs(id: number) {
        const conn = await DBConnection.connect();
        const sql =
            'SELECT * FROM orders_products   WHERE order_id=$1 RETURNING *';
        const result = await conn.query<orders_product>(sql, [id]);
        conn.release();
        return result.rows;
    }
    static async selectOrderP(id: number) {
        const conn = await DBConnection.connect();
        const sql = 'SELECT * FROM orders_products   WHERE id=$1 RETURNING *';
        const result = await conn.query<Order>(sql, [id]);
        conn.release();
        return result.rows[0];
    }
}
