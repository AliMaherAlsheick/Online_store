import express, { Request, Response } from 'express';
import { adminCheck } from '../middelwares/authentication';
import {
    create,
    index,
    show,
    remove,
    update,
    search,
} from '../services/products';
export { productsRoutes };
const productsRoutes = express.Router();
productsRoutes.post('/', adminCheck, create);
productsRoutes.get('/', index);
productsRoutes.get('/:id', show);
productsRoutes.delete('/:id', adminCheck, remove);
productsRoutes.patch('/:id', adminCheck, update);
productsRoutes.put('/', search);
