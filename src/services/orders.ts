import { Request, Response } from 'express';
export {
    index,
    show,
    create,
    remove,
    update,
    showUser,
    updateOrderPpoducts,
    addOrderProduct,
};
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
                msg: 'ok',
                result: await OrdersModel.userOrders(user.id),
            };
        }

        res.send({ message: result.msg, result: result.result });
    } catch (error) {
        res.status(500).send({
            message: 'error encountered',
            error: (error as Error).message,
        });
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
        return res.status(500).send({
            message: 'error encountered',
            error: (error as Error).message,
        });
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
            !orderData?.quantity ||
            !orderData?.product_id ||
            !(await ProductModel.select(orderData?.product_id))?.id ||
            !orderData?.order_address
        )
            return res.status(406).send({
                message:
                    'please complete Order data: product_id ,quantity and ' +
                    'order_address are required , product id must be vaid product_id and quantity must be number',
                orderData,
                body: req.body,
            });
        const Order: Order = await OrdersModel.insert(orderData);
        await OrdersModel.addProduct(Order.id, orderData);

        return res.status(200).json({
            msg: 'Order was addition completed successfully',
            Order,
        });
    } catch (error) {
        return res.status(500).send({
            message: 'error encountered',
            error: (error as Error).message,
        });
    }
}
async function remove(req: Request, res: Response) {
    try {
        const user = await Verfy(req.headers.authorization);
        //if(Number.isNaN(parseInt(req.params.id)))return res.status(400).json({ message: 'you must ass valid ' });
        const order: Order = await OrdersModel.select(parseInt(req.params.id));
        if (!order?.id)
            return res.status(404).json({ message: "Order does n't exist" });
        if (user?.user_type !== 'admin' && user?.id !== order?.user_id)
            return res.status(400).json({ message: 'not allowed' });
        await OrdersModel.removeProducts(Number(req.params.id));
        await OrdersModel.remove(Number(req.params.id));

        return res.status(200).json({
            msg: 'deleted',
        });
    } catch (error) {
        return res.status(500).send({
            message: 'error encountered',
            error: (error as Error).message,
        });
    }
}
async function update(req: Request, res: Response) {
    try {
        const user = await Verfy(req.headers.authorization);
        const order: Order = await OrdersModel.select(parseInt(req.params.id));
        let orderData: OrderDTO = formateOrder(req.body);
        if (!order?.id)
            return res.status(404).json({ message: "Order does n't exist" });
        if (user?.user_type === 'admin') {
        } else if (user?.id === order?.user_id) {
            if (orderData.hasOwnProperty('status')) delete orderData.status;
            if (orderData.hasOwnProperty('user_id')) delete orderData.user_id;
        } else return res.status(400).json({ message: 'not allowed' });
        if (
            !(
                orderData.status ||
                orderData.order_address ||
                orderData.delivery_cost ||
                orderData.user_id
            )
        )
            return res.status(200).json({
                msg: 'add properites to update',
            });
        const Order = await OrdersModel.update(
            orderData,
            parseInt(req.params.id)
        );
        return res.status(200).json({
            msg: 'updated',
            Order,
        });
    } catch (error) {
        return res.status(500).send({
            message: 'error encountered',
            error: (error as Error).message,
        });
    }
}
async function addOrderProduct(req: Request, res: Response) {
    try {
        const order_productData = req.body;
        order_productData.amount = parseInt('' + order_productData.amount);
        order_productData.product_id = parseInt(
            '' + order_productData.product_id
        );
        let order: Order = await OrdersModel.select(parseInt(req.params.id));
        if (order?.user_id !== (await Verfy(req.headers.authorization))?.id)
            return res.status(406).send({
                message: 'not allowed ',
                order_productData,
            });
        if (!order?.id)
            return res.status(406).send({
                message: 'order does not exist ',
                order_productData,
            });
        if (
            !order_productData?.amount ||
            !order_productData?.product_id ||
            !(await ProductModel.select(order_productData?.product_id))?.id
        )
            return res.status(406).send({
                message:
                    'please complete Order data: product_id ,amount and ' +
                    'order_address are required , product id must be vaid product_id and amount must be number',
                order_productData,
            });

        await OrdersModel.addProduct(order.id, order_productData);
        order = await OrdersModel.select(parseInt(req.params.id));
        return res.status(200).json({
            msg: 'Order was addition completed successfully',
            order,
        });
    } catch (error) {
        return res.status(500).send({
            message: 'error encountered',
            error: (error as Error).message,
        });
    }
}
async function updateOrderPpoducts(req: Request, res: Response) {
    try {
        const user = await Verfy(req.headers.authorization);
        const orderP = await OrdersModel.selectOrderP(parseInt(req.params.id));
        let order: Order = await OrdersModel.select(orderP?.order_id);
        if (!orderP?.id || !order?.id)
            return res.status(404).json({ message: "Order does n't exist" });
        if (user?.user_type !== 'admin' && user?.id !== order?.user_id)
            return res.status(400).json({ message: 'not allowed' });
        const orderData = formateOrder(req.body);
        if (orderData?.product_id) {
            const product = await ProductModel.select(orderData.product_id);
            if (!product?.id)
                return res.status(404).json({
                    msg: 'product does not exist',
                });
            const orderProduct = await OrdersModel.updateOrderProduct(
                orderData,
                parseInt(req.params.id)
            );
            order = await OrdersModel.select(orderP.order_id);
            return res.status(200).json({
                msg: 'updated',
                order,
                editedProduct: orderProduct,
            });
        } else if (orderData?.quantity) {
            let orderProduct = await OrdersModel.selectOrderP(
                parseInt(req.params.id)
            );
            const product = await ProductModel.select(orderProduct.product_id);
            if (!product?.id)
                return res.status(404).json({
                    msg: 'product does not exist',
                });
            orderProduct = await OrdersModel.updateOrderProduct(
                orderData,
                orderProduct.id
            );
            order = await OrdersModel.select(orderP.order_id);
            return res.status(200).json({
                msg: 'updated',
                order,
                editedProduct: orderProduct,
            });
        } else {
            await OrdersModel.removeProduct(parseInt(req.params.id));
            order = await OrdersModel.select(orderP.order_id);
            return res.status(200).json({
                msg: 'deleted',
                order,
            });
        }
    } catch (error) {
        return res.status(500).send({
            message: 'error encountered',
            error: (error as Error).message,
        });
    }
}
