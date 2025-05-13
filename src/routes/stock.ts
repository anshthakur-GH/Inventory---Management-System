import { Router } from 'express';
import Product from '../models/Product';
import { Parser } from 'json2csv';

const router = Router();

// List all products for stock management
router.get('/', async (req, res) => {
  const { search } = req.query;
  let query = {};
  if (search) {
    query = { name: { $regex: search, $options: 'i' } };
  }
  const products = await Product.find(query);
  res.render('stock', { products, search: search || '' });
});

// Export products as CSV
router.get('/export', async (req, res) => {
  const products = await Product.find();
  const fields = ['name', 'category', 'price', 'stock', 'lowStockThreshold'];
  const opts = { fields };
  try {
    const parser = new Parser(opts);
    const csv = parser.parse(products.map(p => p.toObject()));
    res.header('Content-Type', 'text/csv');
    res.attachment('products.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).send('Could not export CSV');
  }
});

// Adjust stock for a product
router.post('/adjust/:id', async (req, res) => {
  const { stock } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { stock: parseInt(stock) });
  const products = await Product.find();
  res.render('stock', { products, message: 'Stock updated successfully!' });
});

export default router; 