import { Router } from 'express';
import { Product } from '../models/Product';
import { Op } from 'sequelize';
const router = Router();

// List products with search and filter
router.get('/', async (req, res) => {
  const { search, category } = req.query;
  const where: any = {};
  if (search) where.name = { [Op.like]: `%${search}%` };
  if (category) where.category = category;
  const products = await Product.findAll({ where });
  // Get distinct categories
  const allProducts = await Product.findAll();
  const categories = Array.from(new Set(allProducts.map(p => p.category)));
  res.render('products', { products, categories });
});

// Show add product form
router.get('/add', async (req, res) => {
  const allProducts = await Product.findAll();
  const categories = Array.from(new Set(allProducts.map(p => p.category)));
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
  const product = await Product.findByPk(req.params.id);
  const allProducts = await Product.findAll();
  const categories = Array.from(new Set(allProducts.map(p => p.category)));
  res.render('editProduct', { product, categories });
});

// Handle edit product
router.post('/edit/:id', async (req, res) => {
  const { name, category, price, stock, image, lowStockThreshold } = req.body;
  await Product.update(
    { name, category, price, stock, image, lowStockThreshold },
    { where: { id: req.params.id } }
  );
  res.redirect('/products');
});

// Handle delete product
router.post('/delete/:id', async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.redirect('/products');
});

export default router; 