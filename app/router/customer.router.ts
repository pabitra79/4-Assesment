import express from 'express';
import * as customerController from '../controller/customer.controller';

const router = express.Router();

// Homepage with products
router.get('/', customerController.getHomepage);

// Product detail page
router.get('/product/:slug', customerController.getProductDetail);
router.get('/product/id/:id', customerController.getProductDetail);

export default router;