import { Request, Response } from 'express';
export {
    index,
    show,
    create,
    remove,
    update,
    showUser,
    updateOrderProduct,
    removeOrder,
};
import { OrdersModel } from '../models/orders';
import { UserModel } from '../models/user';
import { Order, OrderDTO, orders_product } from '../types/types';
import { formateOrder, Verfy } from '../utilites/utilites';
async function index(req: Request, res: Response) {
    try {
        const user = await UserModel.select(
            (
                Verfy(req.headers.authorization) as {
                    id: number;
                }
            )?.id
        );
        let result: { result: unknown; msg: string };
        if (user.user_type === 'admin') {
            result = { msg: 'ok', result: await OrdersModel.selectAll() };
        } else {
            result = await showUser(user.id);
        }

        res.send({ message: result.msg, result: result.result });
    } catch (error) {
        res.status(500).send({ message: 'error encountered', error });
    }
}
async function show(req: Request, res: Response) {
    try {
        const order: Order = await OrdersModel.select(parseInt(req.params.id));
        if (!order)
            return res.status(404).json({ message: "Order does n't exist" });
        return res.status(200).json({ message: 'show', order });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function showUser(id: number): Promise<{ msg: string; result: unknown }> {
    try {
        const orders: Order[] = await OrdersModel.userOrders(id);

        if (!orders.length) return { msg: "Order does n't exist", result: [] };
        return { msg: 'show', result: [] };
    } catch (error) {
        return {
            msg: 'error encountered',

            result: error,
        };
    }
}
async function create(req: Request, res: Response) {
    try {
        let orderData: OrderDTO = req.body;
        orderData.user_id = (
            Verfy(req.headers.authorization) as {
                id: number;
            }
        )?.id;

        if (Number.isNaN(Number(orderData.product_id)))
            return res.status(406).send({
                message: 'please complete Order data',
                orderData,
            });

        orderData = await formateOrder(orderData, req.headers.authorization);

        if (Number.isNaN(Number(orderData.amount)))
            return res.status(406).send({
                message: 'amount must be integer',
                num: orderData,
                req: req.body,
            });
        orderData.amount = Math.floor(Number(orderData.amount));
        orderData.product_id = Math.floor(Number(orderData.product_id));
        orderData.user_id = Math.floor(Number(orderData.user_id));
        orderData.status = 'active';
        const Order: Order = await OrdersModel.insert(orderData);
        await OrdersModel.addProduct(Order.id, orderData);

        return res.status(200).json({
            msg: 'Order was addition completed successfully',
            Order,
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function remove(req: Request, res: Response) {
    try {
        const Order = await OrdersModel.select(parseInt(req.params.id));
        if (!Order)
            return res.status(404).json({ message: 'Order does not exist' });
        await OrdersModel.remove(Number(req.params.id));
        await OrdersModel.removeProducts(Number(req.params.id));
        return res.status(200).json({
            msg: 'deleted',
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function update(req: Request, res: Response) {
    try {
        const order = await OrdersModel.select(parseInt(req.params.id));
        if (!order)
            return res.status(404).json({ message: 'Order does not exist' });
        let orderData: OrderDTO = req.body;
        orderData.amount = Math.floor(Number(orderData.amount));
        orderData.product_id = Math.floor(Number(orderData.product_id));
        orderData = await formateOrder(orderData, req.headers.authorization);
        const Order = await OrdersModel.update(
            orderData,
            parseInt(req.params.id)
        );
        let result: orders_product;
        if (orderData.product_id) {
            result = await OrdersModel.addProduct(
                parseInt(req.params.id),
                orderData
            );
            Order.products = [result];
        }

        return res.status(200).json({
            msg: 'updated',
            Order,
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function updateOrderProduct(req: Request, res: Response) {
    try {
        const order = await OrdersModel.select(parseInt(req.params.id));
        if (!order)
            return res.status(404).json({ message: 'Order does not exist' });
        let orderData: OrderDTO = req.body;
        orderData.amount = Math.floor(Number(orderData.amount));
        orderData.product_id = Math.floor(Number(orderData.product_id));
        orderData = await formateOrder(orderData, req.headers.authorization);
        const Order = await OrdersModel.update(
            orderData,
            parseInt(req.params.id)
        );
        return res.status(200).json({
            msg: 'updated',
            Order,
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function removeOrder(req: Request, res: Response) {
    try {
        const order = await OrdersModel.select(parseInt(req.params.id));
        if (!order)
            return res.status(404).json({ message: 'Order does not exist' });

        const Order = await OrdersModel.removeProduct(parseInt(req.params.id));
        return res.status(200).json({
            msg: 'updated',
            Order,
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
