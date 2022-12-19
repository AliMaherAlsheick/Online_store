import express from 'express';
import { adminCheck, userCheck } from '../middelwares/authentication';
import {
    index,
    show,
    create,
    remove,
    update,
    removeOrderProduct,
} from '../services/orders';
export { ordersRoutes };
const ordersRoutes = express.Router();
ordersRoutes.get('/:id', userCheck, show);
ordersRoutes.get('/', adminCheck, index);
ordersRoutes.post('/', userCheck, create);
ordersRoutes.delete('/:Id', userCheck, remove);
ordersRoutes.patch('/:id', userCheck, update);
ordersRoutes.put('/:id', userCheck, removeOrderProduct);
