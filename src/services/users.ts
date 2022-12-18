import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { User } from '../types/types';
import {
    formateNewUser,
    getJWT,
    passwordConstrainsCheck,
    userNameConstrainsCheck,
    passwordValidation,
    checkUserExistance,
} from '../utilites/utilites';
export { index, show, signUp, remove, update, logIn };

async function index(req: Request, res: Response) {
    try {
        const users: User[] = await UserModel.selectAll();
        res.send({ message: 'ok', users });
    } catch (error) {
        res.status(500).send({ message: 'error encountered', error });
    }
}
async function show(req: Request, res: Response): Promise<Response> {
    try {
        const user: User = await UserModel.select(parseInt(req.params.id));

        if (!user)
            return res.status(404).json({ message: "user does n't exist" });
        user.user_password = '********';
        return res.status(200).json({ message: 'show', user });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function signUp(req: Request, res: Response): Promise<Response> {
    try {
        let userData: User = req.body;

        if (
            !(
                userData.first_name &&
                userData.last_name &&
                userData.user_name &&
                userData.user_password
            )
        )
            return res.status(406).send({
                message: 'please complete your data',
            });
        const checkPassword = passwordConstrainsCheck(userData.user_password);
        const checkuserName = await userNameConstrainsCheck(userData);
        if (!checkPassword.valid)
            return res.status(406).send({
                message: checkPassword.msg,
            });
        if (!checkuserName.valid)
            return res.status(406).send({
                message: checkuserName.msg,
            });
        const passStars = new Array(userData.user_password.length)
            .fill('*')
            .join('');
        if (process.env.ADMIN === userData.user_name) {
            if (process.env.ADMIN_PASS === userData.user_password) {
                userData.user_type = 'admin';
            } else {
                return res.status(406).send({
                    message: 'user name already in use',
                });
            }
        } else userData.user_type = 'guest';

        userData = await formateNewUser(userData);
        const user: User = await UserModel.insert(userData);
        const jwt: string = getJWT(user.id);
        return res.status(200).json({
            msg: 'signUp completed successfully',
            jwt,
            userName: user.user_name,
            password: passStars,
            id: user.id,
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function remove(req: Request, res: Response) {
    try {
        const result = await checkUserExistance(
            parseInt(req.params.id),
            req.body.user_password
        );
        if (!result.valid) return res.status(404).json({ message: result.msg });
        const user = await UserModel.remove(parseInt(req.params.id));
        return res.status(200).json({
            msg: 'deleted',
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function update(req: Request, res: Response) {
    try {
        const result = await checkUserExistance(
            parseInt(req.params.id),
            req.body.user_password
        );
        if (!result.valid) return res.status(404).json({ message: result.msg });

        const user = await UserModel.update(req.body, parseInt(req.params.id));
        user.user_password = '********';
        return res.status(200).json({
            msg: 'updated',
            user,
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function logIn(req: Request, res: Response): Promise<Response> {
    try {
        const user = await UserModel.selectUser(req.body.user_name);
        if (!user?.user_password)
            return res.status(406).json({ message: 'invalid user name' });

        const result = await passwordValidation(
            req.body.user_password,
            user?.user_password
        );
        if (result) {
            const jwt: string = getJWT(parseInt(req.params.id));
            return res.status(200).json({
                msg: 'done',
                id: user.id,
                jwt,
            });
        }

        return res.status(406).json({ message: 'wrong password' });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
