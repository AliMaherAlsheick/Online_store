import {
    OrderDTO,
    ProductDTO,
    User,
    UserDTO,
    validationResponse,
} from '../types/types';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
export function passwordConstrainsCheck(password: string): validationResponse {
    if (password.length < 8)
        return {
            valid: false,
            msg: 'password must be eight characters or more ',
        };
    return {
        valid: true,
        msg: 'ok',
    };
}
export async function userNameConstrainsCheck(
    user: UserDTO
): Promise<validationResponse> {
    try {
        const Usr = await UserModel.selectUser(user.user_name as string);

        if (Usr?.user_password)
            return {
                valid: false,
                msg: 'username already in use',
            };
        return {
            valid: true,
            msg: 'ok',
        };
    } catch (err) {
        throw err;
    }
}

export async function formateNewUser(userData: UserDTO): Promise<UserDTO> {
    try {
        const today: Date = new Date();
        userData.date_of_creation =
            today.getMonth() +
            1 +
            '-' +
            today.getDate() +
            '-' +
            today.getFullYear();
        userData.user_password = await hashPassword(
            userData.user_password as string
        );
        return userData;
    } catch (err) {
        throw err;
    }
}
export function getJWT(id: number): string {
    return jwt.sign({ id }, process.env.STORE_JWT_TOKEN as string);
}
export async function passwordValidation(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    try {
        const piper: string = process.env.STORE_PIPER as string;
        const result = await bcrypt.compare(password + piper, hashedPassword);

        return result;
    } catch (err) {
        throw err;
    }
}

export function generateUpdataSQL(
    user: UserDTO
): [string, (string | undefined)[]] {
    let sql: string = 'UPDATE users SET ';
    let n: number = 1;
    const coloums: string[] = [];
    const theArray: (string | undefined)[] = [];
    const keys = [
        'first_name',
        'last_name',
        'date_of_creation',
        'email',
        'user_name',
        'user_password',
        'user_type',
        'phone',
    ] as unknown as (keyof UserDTO)[];
    for (let key of keys) {
        if (user.hasOwnProperty(key)) {
            coloums.push(key + '=$' + ++n);
            theArray.push(user[key]);
        }
    }
    sql += coloums.join(',') + ' WHERE id=$1 RETURNING *';
    return [sql, theArray];
}
export function formateProduct(productData: ProductDTO): ProductDTO {
    productData.amount = Number(productData.amount);
    productData.amount = Number(productData.amount);
    const today: Date = new Date();
    productData.date_of_change =
        today.getMonth() +
        1 +
        '-' +
        today.getDate() +
        '-' +
        today.getFullYear();
    return productData;
}
export function generateProductUpdataSQL(product: ProductDTO) {
    let sql: string = 'UPDATE products SET ';
    let n: number = 1;
    const coloums: string[] = [];
    const theArray = [];
    const keys = [
        'name',
        'price',
        'amount',
        'img_url',
        'rating',
        'date_of_change',
        'category',
    ] as unknown as (keyof ProductDTO)[];
    for (let key of keys) {
        if (product.hasOwnProperty(key)) {
            coloums.push(key + '=$' + ++n);
            theArray.push(product[key]);
        }
    }
    sql += coloums.join(',') + ' WHERE id=$1 RETURNING *';
    return { sql, theArray };
}
export function formateOrder(orderData: OrderDTO) {
    const today: Date = new Date();
    orderData.date =
        today.getMonth() +
        1 +
        '-' +
        today.getDate() +
        '-' +
        today.getFullYear();
    orderData.amount = parseInt('' + orderData.amount);
    orderData.product_id = parseInt('' + orderData.product_id);
    return orderData;
}
export async function Verfy(authorization: string | undefined): Promise<User> {
    try {
        const JWT = authorization?.split(' ')[1] ?? '';

        const user = UserModel.select(
            (
                jwt.verify(JWT, process.env.STORE_JWT_TOKEN as string) as {
                    id: number;
                }
            )?.id
        );
        return user;
    } catch (err) {
        throw err;
    }
}
export function getMonthPeriod(): string {
    const today: Date = new Date();
    const todayDate =
        today.getMonth() +
        1 +
        '-' +
        today.getDate() +
        '-' +
        today.getFullYear();
    const lastM: Date = new Date();
    lastM.setMonth(lastM.getMonth() - 1);
    const lastMD =
        lastM.getMonth() +
        1 +
        '-' +
        lastM.getDate() +
        '-' +
        lastM.getFullYear();
    return "'" + lastMD + "'" + ' AND ' + "'" + todayDate + "'";
}
export async function hashPassword(pass: string): Promise<string> {
    try {
        const salt: number = parseInt(process.env.STORE_SALT as string);
        const piper: string = process.env.STORE_PIPER as string;
        pass = await bcrypt.hash(pass + piper, salt);
        return pass;
    } catch (err) {
        throw err;
    }
}
