import express from 'express';
import * as adminController from '../controller/admin.controller';
import { upload } from '../config/multer';

const router = express.Router();

// Dashboard
router.get('/', adminController.getDashboard);

// Category routes
router.get('/categories', adminController.getCategories);
router.get('/categories/add', adminController.getAddCategory);
router.post('/categories/add', adminController.postAddCategory);
router.get('/categories/edit/:id', adminController.getEditCategory);
router.post('/categories/edit/:id', adminController.postEditCategory);
router.post('/categories/delete/:id', adminController.deleteCategory);

// Product routes
router.get('/products', adminController.getProducts);
router.get('/products/add', adminController.getAddProduct);
router.post('/products/add', upload.single('image'), adminController.postAddProduct);
router.get('/products/edit/:id', adminController.getEditProduct);
router.post('/products/edit/:id', upload.single('image'), adminController.postEditProduct);
router.post('/products/delete/:id', adminController.deleteProduct);

export default router;