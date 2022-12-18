import { Request, Response } from 'express';
export { index, show, create, remove, update };
import { ProductModel } from '../models/product';
import { Product, ProductDTO } from '../types/types';
import { formateProduct } from '../utilites/utilites';
async function index(req: Request, res: Response) {
    try {
        const products: Product[] = await ProductModel.selectAll();
        res.send({ message: 'ok', products });
    } catch (error) {
        res.status(500).send({ message: 'error encountered', error });
    }
}
async function show(req: Request, res: Response): Promise<Response> {
    try {
        const product: Product = await ProductModel.select(
            parseInt(req.params.id)
        );

        if (!product)
            return res.status(404).json({ message: "product does n't exist" });
        return res.status(200).json({ message: 'show', product });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function create(req: Request, res: Response): Promise<Response> {
    try {
        let productData: ProductDTO = req.body;

        if (!(productData.amount && productData.name && productData.price))
            return res.status(406).send({
                message: 'please complete product data',
            });
        productData = formateProduct(productData);
        if (Number.isNaN(productData.price))
            return res.status(406).send({
                message: 'price must be number',
            });
        if (Number.isNaN(productData.amount))
            return res.status(406).send({
                message: 'amount must be integer',
            });
        productData.amount = Math.floor(productData.amount);
        const product: Product = await ProductModel.insert(productData);
        return res.status(200).json({
            msg: 'product was addition completed successfully',
            product,
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function remove(req: Request, res: Response) {
    try {
        const Product = await ProductModel.select(parseInt(req.params.id));
        if (!Product)
            return res.status(404).json({ message: 'product does not exist' });
        await ProductModel.remove(Number(req.params.id));
        return res.status(200).json({
            msg: 'deleted',
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
async function update(req: Request, res: Response) {
    try {
        const Product = await ProductModel.select(parseInt(req.params.id));
        if (!Product)
            return res.status(404).json({ message: 'product does not exist' });
        let productData: ProductDTO = req.body;
        productData = formateProduct(productData);
        if (Number.isNaN(productData.price))
            return res.status(406).send({
                message: 'price must be number',
            });
        if (Number.isNaN(productData.amount))
            return res.status(406).send({
                message: 'amount must be integer',
            });
        productData.amount = Math.floor(productData.amount);
        const product = await ProductModel.update(
            productData,
            parseInt(req.params.id)
        );
        return res.status(200).json({
            msg: 'updated',
            product,
        });
    } catch (error) {
        return res.status(500).send({ message: 'error encountered', error });
    }
}
