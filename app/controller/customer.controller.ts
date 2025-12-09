import { Request, Response } from 'express';
import Product from '../model/Product';
import Category from '../model/Category';

export const getHomepage = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    
    let query: any = { isDeleted: false };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('category')
      .sort({ createdAt: -1 });

    const categories = await Category.find({ isDeleted: false }).sort({ name: 1 });

    res.render('customer/homepage', {
      title: 'Products',
      products,
      categories,
      selectedCategory: category || '',
      searchQuery: search || ''
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error loading products'
    });
  }
};

export const getProductDetail = async (req: Request, res: Response) => {
  try {
    const { slug, id } = req.params;
    
    let product;
    if (slug) {
      product = await Product.findOne({ slug, isDeleted: false }).populate('category');
    } else if (id) {
      product = await Product.findOne({ _id: id, isDeleted: false }).populate('category');
    }

    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/');
    }

    res.render('customer/product-detail', {
      title: product.name,
      product
    });
  } catch (error) {
    req.flash('error', 'Error loading product');
    res.redirect('/');
  }
};