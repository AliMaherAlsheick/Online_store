import { User } from '../types/types';
import { DBConnection } from '../config/database/database';
import { generateUpdataSQL } from '../utilites/utilites';
export { UserModel };
class UserModel {
    static async selectAll(): Promise<User[]> {
        const conn = await DBConnection.connect();
        const sql = 'SELECT * FROM users';
        const result = await conn.query<User>(sql);
        conn.release();
        return result.rows;
    }
    static async select(id: number): Promise<User> {
        const conn = await DBConnection.connect();
        const sql = 'SELECT * FROM users WHERE id=$1';
        const result = await conn.query<User>(sql, [id]);
        conn.release();
        return result.rows[0];
    }
    static async selectUser(user_name: string): Promise<User> {
        const conn = await DBConnection.connect();
        const sql = 'SELECT * FROM users WHERE user_name=$1';
        const result = await conn.query<User>(sql, [user_name]);
        conn.release();
        return result.rows[0];
    }
    static async insert(user: User): Promise<User> {
        const conn = await DBConnection.connect();
        const sql =
            'INSERT INTO users (first_name ,last_name ,date_of_creation,email ,user_name,user_password,phone,user_type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) returning *';
        const result = await conn.query<User>(sql, [
            user.first_name,
            user.last_name,
            user.date_of_creation,
            user.email,
            user.user_name,
            user.user_password,
            user.phone,
            user.user_type,
        ]);
        conn.release();
        return result.rows[0];
    }
    static async remove(id: number): Promise<User> {
        const conn = await DBConnection.connect();
        const sql = 'DELETE FROM users WHERE id=$1 RETURNING *';
        const result = await conn.query<User>(sql, [id]);
        conn.release();
        return result.rows[0];
    }
    static async update(user: User, id: number): Promise<User> {
        const conn = await DBConnection.connect();
        const result = await conn.query<User>(generateUpdataSQL(user, id)[0], [
            id,
            ...generateUpdataSQL(user, id)[1],
        ]);
        conn.release();

        return result.rows[0];
    }
}
