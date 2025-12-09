import { Request, Response } from 'express';
import Category from '../model/Category';
import Product from '../model/Product';
import { categoryValidation, productValidation, productUpdateValidation } from '../helper/validation';
import { deleteFile } from '../config/multer';

// Dashboard
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const totalProducts = await Product.countDocuments({ isDeleted: false });
    const totalCategories = await Category.countDocuments({ isDeleted: false });

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      totalProducts,
      totalCategories
    });
  } catch (error) {
    req.flash('error', 'Error loading dashboard');
    res.redirect('/admin');
  }
};

// Category Controllers
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.render('admin/categories/list', {
      title: 'Categories',
      categories
    });
  } catch (error) {
    req.flash('error', 'Error loading categories');
    res.redirect('/admin');
  }
};

export const getAddCategory = (req: Request, res: Response) => {
  res.render('admin/categories/add', {
    title: 'Add Category'
  });
};

export const postAddCategory = async (req: Request, res: Response) => {
  try {
    console.log('Request body:', req.body); // Debug log
    
    const { error } = categoryValidation.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message); 
      req.flash('error', error.details[0].message);
      return res.redirect('/admin/categories/add');
    }

    const category = new Category({
      name: req.body.name
    });

    await category.save();
    console.log('Category saved successfully'); 
    req.flash('success', 'Category added successfully');
    res.redirect('/admin/categories');
  } catch (error: any) {
    console.error('Error in postAddCategory:', error); 
    if (error.code === 11000) {
      req.flash('error', 'Category with this name already exists');
    } else {
      req.flash('error', 'Error adding category');
    }
    res.redirect('/admin/categories/add');
  }
};

export const getEditCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.isDeleted) {
      req.flash('error', 'Category not found');
      return res.redirect('/admin/categories');
    }

    res.render('admin/categories/edit', {
      title: 'Edit Category',
      category
    });
  } catch (error) {
    req.flash('error', 'Error loading category');
    res.redirect('/admin/categories');
  }
};

export const postEditCategory = async (req: Request, res: Response) => {
  try {
    const { error } = categoryValidation.validate(req.body);
    if (error) {
      req.flash('error', error.details[0].message);
      return res.redirect(`/admin/categories/edit/${req.params.id}`);
    }

    const category = await Category.findById(req.params.id);
    if (!category || category.isDeleted) {
      req.flash('error', 'Category not found');
      return res.redirect('/admin/categories');
    }

    category.name = req.body.name;
    await category.save();

    req.flash('success', 'Category updated successfully');
    res.redirect('/admin/categories');
  } catch (error: any) {
    if (error.code === 11000) {
      req.flash('error', 'Category with this name already exists');
    } else {
      req.flash('error', 'Error updating category');
    }
    res.redirect(`/admin/categories/edit/${req.params.id}`);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash('error', 'Category not found');
      return res.redirect('/admin/categories');
    }

    category.isDeleted = true;
    await category.save();

    req.flash('success', 'Category deleted successfully');
    res.redirect('/admin/categories');
  } catch (error) {
    req.flash('error', 'Error deleting category');
    res.redirect('/admin/categories');
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .populate('category')
      .sort({ createdAt: -1 });

    res.render('admin/products/list', {
      title: 'Products',
      products
    });
  } catch (error) {
    req.flash('error', 'Error loading products');
    res.redirect('/admin');
  }
};

export const getAddProduct = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isDeleted: false }).sort({ name: 1 });
    res.render('admin/products/add', {
      title: 'Add Product',
      categories
    });
  } catch (error) {
    req.flash('error', 'Error loading form');
    res.redirect('/admin/products');
  }
};

export const postAddProduct = async (req: Request, res: Response) => {
  try {
    const { error } = productValidation.validate(req.body);
    if (error) {
      if (req.file) deleteFile(req.file.filename);
      req.flash('error', error.details[0].message);
      return res.redirect('/admin/products/add');
    }

    if (!req.file) {
      req.flash('error', 'Product image is required');
      return res.redirect('/admin/products/add');
    }

    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      image: req.file.filename
    });

    await product.save();
    req.flash('success', 'Product added successfully');
    res.redirect('/admin/products');
  } catch (error: any) {
    if (req.file) deleteFile(req.file.filename);
    if (error.code === 11000) {
      req.flash('error', 'Product with this name already exists');
    } else {
      req.flash('error', 'Error adding product');
    }
    res.redirect('/admin/products/add');
  }
};

export const getEditProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    const categories = await Category.find({ isDeleted: false }).sort({ name: 1 });

    if (!product || product.isDeleted) {
      req.flash('error', 'Product not found');
      return res.redirect('/admin/products');
    }

    res.render('admin/products/edit', {
      title: 'Edit Product',
      product,
      categories
    });
  } catch (error) {
    req.flash('error', 'Error loading product');
    res.redirect('/admin/products');
  }
};

export const postEditProduct = async (req: Request, res: Response) => {
  try {
    const { error } = productUpdateValidation.validate(req.body);
    if (error) {
      if (req.file) deleteFile(req.file.filename);
      req.flash('error', error.details[0].message);
      return res.redirect(`/admin/products/edit/${req.params.id}`);
    }

    const product = await Product.findById(req.params.id);
    if (!product || product.isDeleted) {
      if (req.file) deleteFile(req.file.filename);
      req.flash('error', 'Product not found');
      return res.redirect('/admin/products');
    }

    product.name = req.body.name;
    product.category = req.body.category;
    product.description = req.body.description;
    if (req.file) {
      deleteFile(product.image); 
      product.image = req.file.filename;
    }

    await product.save();
    req.flash('success', 'Product updated successfully');
    res.redirect('/admin/products');
  } catch (error: any) {
    if (req.file) deleteFile(req.file.filename);
    if (error.code === 11000) {
      req.flash('error', 'Product with this name already exists');
    } else {
      req.flash('error', 'Error updating product');
    }
    res.redirect(`/admin/products/edit/${req.params.id}`);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/admin/products');
    }

    product.isDeleted = true;
    await product.save();
    deleteFile(product.image); 

    req.flash('success', 'Product deleted successfully');
    res.redirect('/admin/products');
  } catch (error) {
    req.flash('error', 'Error deleting product');
    res.redirect('/admin/products');
  }
};