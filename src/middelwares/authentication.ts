import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import 'dotenv/config';
import { UserModel } from '../models/user';
import { User } from '../types/types';
import { Verfy } from '../utilites/utilites';
export { userCheck };
async function userCheck(
    req: Request,
    res: Response,
    NextFunction: NextFunction
): Promise<void> {
    try {
        await Verfy(req.headers.authorization);
        NextFunction();
    } catch (error) {
        res.status(400).json({
            message: 'invalid token please signIn or signUp',
            error,
        });
    }
}
export async function adminCheck(
    req: Request,
    res: Response,
    NextFunction: NextFunction
): Promise<void | Response> {
    try {
        const user: User = await Verfy(req.headers.authorization);
        if (user.user_type === 'admin') NextFunction();
        else
            return res.status(400).json({
                message: 'only admin is allower to perform this action',
            });
    } catch (error) {
        return res.status(400).json({
            message: 'invalid token please signIn or signUp',
            error,
        });
    }
}
