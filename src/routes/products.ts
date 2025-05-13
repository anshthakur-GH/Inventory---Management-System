import { Router } from 'express';
import Product from '../models/Product';
const router = Router();

// List products with search and filter
router.get('/', async (req, res) => {
  const { search, category } = req.query;
  const query: any = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  const products = await Product.find(query);
  const categories = await Product.distinct('category');
  res.render('products', { products, categories });
});

// Show add product form
router.get('/add', async (req, res) => {
  const categories = await Product.distinct('category');
  res.render('addProduct', { categories });
});

// Handle add product
router.post('/add', async (req, res) => {
  const { name, category, price, stock, image, lowStockThreshold } = req.body;
  await Product.create({ name, category, price, stock, image, lowStockThreshold });
  res.redirect('/products');
});

// Show edit product form
router.get('/edit/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  const categories = await Product.distinct('category');
  res.render('editProduct', { product, categories });
});

// Handle edit product
router.post('/edit/:id', async (req, res) => {
  const { name, category, price, stock, image, lowStockThreshold } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, category, price, stock, image, lowStockThreshold });
  res.redirect('/products');
});

// Handle delete product
router.post('/delete/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/products');
});

export default router; 