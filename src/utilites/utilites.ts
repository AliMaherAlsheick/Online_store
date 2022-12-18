import { OrderDTO, ProductDTO, User, validationResponse } from '../types/types';
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
    user: User
): Promise<validationResponse> {
    const Usr = await UserModel.selectUser(user.user_name);

    if (Usr?.user_password)
        return {
            valid: false,
            msg: 'username already in use',
        };
    return {
        valid: true,
        msg: 'ok',
    };
}

export async function formateNewUser(userData: User): Promise<User> {
    const today: Date = new Date();
    userData.date_of_creation =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();

    const salt: number = parseInt(process.env.STORE_SALT as string);
    const piper: string = process.env.STORE_PIPER as string;
    userData.user_password = await bcrypt.hash(
        userData.user_password + piper,
        salt
    );
    return userData;
}
export function getJWT(id: number): string {
    const jwtSecretToken = process.env.STORE_JWT_TOKEN as string;
    return jwt.sign({ id }, jwtSecretToken);
}
export async function passwordValidation(
    password: string,
    dbpassword: string
): Promise<boolean> {
    const piper: string = process.env.STORE_PIPER as string;
    const result = await bcrypt.compare(password + piper, dbpassword);

    return result;
}
export async function checkUserExistance(
    id: number,
    user_password: string
): Promise<validationResponse> {
    const user = await UserModel.select(id);
    if (!user?.user_password) return { valid: false, msg: 'invalid user name' };

    const result = await passwordValidation(user_password, user.user_password);
    if (result) {
        return {
            valid: true,
            msg: 'done',
        };
    }
    return { valid: false, msg: 'wrong password' };
}
export function generateUpdataSQL(user: User, id: number): [string, string[]] {
    let sql: string = 'UPDATE users SET ';
    let n: number = 1;
    const coloums: string[] = [];
    const theArray: string[] = [];
    const entries = Object.entries(user);
    for (let entry of entries) {
        coloums.push((entry[0] += '=$' + ++n));
        theArray.push(entry[1]);
    }
    sql += coloums.join(',') + ' WHERE id=$1 RETURNING *';
    return [sql, theArray];
}
export function formateProduct(productData: ProductDTO): ProductDTO {
    productData.amount = Number(productData.amount);
    productData.amount = Number(productData.amount);
    const today: Date = new Date();
    productData.date_of_change =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
    return productData;
}
export function generateProductUpdataSQL(product: ProductDTO) {
    let sql: string = 'UPDATE products SET ';
    let n: number = 1;
    const coloums: string[] = [];
    const theArray = [];
    const entries = Object.entries(product);
    for (let entry of entries) {
        coloums.push((entry[0] += '=$' + ++n));
        theArray.push(entry[1]);
    }
    sql += coloums.join(',') + ' WHERE id=$1 RETURNING *';
    return { sql, theArray };
}
export async function formateOrder(
    orderData: OrderDTO,
    authorization: undefined | string
) {
    try {
        const JWT = authorization?.split(' ')[1] ?? '';

        const today: Date = new Date();
        orderData.date =
            today.getFullYear() +
            '-' +
            (today.getMonth() + 1) +
            '-' +
            today.getDate();

        orderData.user_id = (
            jwt.verify(JWT, process.env.STORE_JWT_TOKEN as string) as {
                id: number;
            }
        )?.id;
    } catch (error) {}
    return orderData;
}
export function Verfy(authorization: string | undefined) {
    const JWT = authorization?.split(' ')[1] ?? '';
    return jwt.verify(JWT, process.env.STORE_JWT_TOKEN as string);
}
export function getMonthPeriod(): string {
    const today: Date = new Date();
    const todayDate =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
    const lastM: Date = new Date();
    lastM.setMonth(lastM.getMonth() - 1);
    const lastMD =
        lastM.getFullYear() +
        '-' +
        (lastM.getMonth() + 1) +
        '-' +
        lastM.getDate();
    return todayDate + ' AND ' + lastMD + ';';
}
