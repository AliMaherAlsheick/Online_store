import express from 'express';
import { adminCheck, userCheck } from '../middelwares/authentication';
import {
    index,
    show,
    create,
    remove,
    update,
    updateOrderPpoducts,
    addOrderProduct,
} from '../services/orders';
export { ordersRoutes };
const ordersRoutes = express.Router();
ordersRoutes.get('/:id', userCheck, show);
ordersRoutes.get('/', userCheck, index);
ordersRoutes.post('/', userCheck, create);
ordersRoutes.post('/:id', userCheck, addOrderProduct);
ordersRoutes.delete('/:id', userCheck, remove);
ordersRoutes.patch('/:id', userCheck, update);
ordersRoutes.put('/:id', userCheck, updateOrderPpoducts);
//tests and markdown
