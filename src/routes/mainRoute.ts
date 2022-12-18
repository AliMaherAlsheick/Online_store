import express from 'express';
import { usersRoutes } from './users';
import { productsRoutes } from './products';
import { ordersRoutes } from './orders';
export { appRoutes };

const appRoutes = express.Router();
appRoutes.use('/user', usersRoutes);
appRoutes.use('/product', productsRoutes);
appRoutes.use('/order', ordersRoutes);
