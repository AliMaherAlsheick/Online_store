import { Request, Response } from 'express';
export { index, show, create, remove, update, showUser, removeOrderProduct };
import { OrdersModel } from '../models/orders';
import { ProductModel } from '../models/product';
import { Order, OrderDTO, orders_product } from '../types/types';
import { formateOrder, Verfy } from '../utilites/utilites';
async function index(req: Request, res: Response) {
    try {
        const user = await Verfy(req.headers.authorization);

        let result: { result: unknown; msg: string };
        if (user?.user_type === 'admin') {
            result = { msg: 'ok', result: await OrdersModel.selectAll() };
        } else {
            const reslt = await showUser(user.id);
            result = {
                msg: reslt instanceof Error ? 'error encountered' : 'ok',
                result: reslt instanceof Error ? reslt.message : reslt,
            };
        }

        res.send({ message: result.msg, result: result.result });
    } catch (error) {
        res.status(500).send({ message: 'error encountered', error });
    }
}
async function show(req: Request, res: Response) {
    try {
        const user = await Verfy(req.headers.authorization);
        let result: { result: unknown; msg: string };
        const order: Order = await OrdersModel.select(parseInt(req.params.id));
        if (!order?.id)
            return res.status(404).json({ message: "Order does n't exist" });
        if (user?.user_type === 'admin') {
            result = { msg: 'ok', result: order };
        } else if (user?.id === order?.user_id) {
            result = { msg: 'ok', result: order };
        } else return res.status(400).json({ message: 'not allowed' });
        return res.status(200).json({ message: 'show', order });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function showUser(id: number): Promise<Order[] | Error> {
    try {
        const orders: Order[] = await OrdersModel.userOrders(id);

        if (!orders.length) return [];
        return orders;
    } catch (error: unknown) {
        return new Error((error as { message: string })?.message);
    }
}
async function create(req: Request, res: Response) {
    try {
        const orderData: OrderDTO = formateOrder(req.body);
        orderData.user_id = (await Verfy(req.headers.authorization))?.id;
        orderData.status = 'active';
        if (
            !orderData?.amount ||
            !orderData?.product_id ||
            !(await ProductModel.select(orderData?.product_id)).id ||
            !orderData?.order_address
        )
            return res.status(406).send({
                message:
                    'please complete Order data: product_id ,amount and ' +
                    'order_address are required , product id must be vaid product_id and amount must be number',
                orderData,
            });
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
        const user = await Verfy(req.headers.authorization);
        const order: Order = await OrdersModel.select(parseInt(req.params.id));
        if (!order?.id)
            return res.status(404).json({ message: "Order does n't exist" });
        if (user?.user_type !== 'admin' && user?.id !== order?.user_id)
            return res.status(400).json({ message: 'not allowed' });
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
        const user = await Verfy(req.headers.authorization);
        const order: Order = await OrdersModel.select(parseInt(req.params.id));
        let orderData: OrderDTO = await formateOrder(req.body);
        if (!order?.id)
            return res.status(404).json({ message: "Order does n't exist" });
        if (user?.user_type === 'admin') {
        } else if (user?.id === order?.user_id) {
        } else return res.status(400).json({ message: 'not allowed' });
        const Order = await OrdersModel.update(
            orderData,
            parseInt(req.params.id)
        );
        if (orderData?.product_id) {
            Order.products = [
                await OrdersModel.updateOrderProduct(
                    orderData,
                    orderData.product_id
                ),
            ];
        } else {
            Order.products = [
                await OrdersModel.addProduct(
                    parseInt(req.params.id),
                    orderData
                ),
            ];
        }

        return res.status(200).json({
            msg: 'updated',
            Order,
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function removeOrderProduct(req: Request, res: Response) {
    try {
        const user = await Verfy(req.headers.authorization);
        const order: Order = await OrdersModel.select(
            parseInt(req.body.order_id)
        );
        if (!order?.id)
            return res.status(404).json({ message: "Order does n't exist" });
        if (user?.user_type !== 'admin' && user?.id !== order?.user_id)
            return res.status(400).json({ message: 'not allowed' });
        const orderP = await OrdersModel.selectOrderP(parseInt(req.params.id));
        if (!orderP?.id)
            return res
                .status(404)
                .json({ message: 'Order_product does not exist' });
        const Order = await OrdersModel.removeProduct(parseInt(req.params.id));
        return res.status(200).json({
            msg: 'deleted',
            Order,
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
