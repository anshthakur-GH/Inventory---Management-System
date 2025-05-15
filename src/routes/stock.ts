import { Router } from 'express';
import { Product } from '../models/Product';
import { Parser } from 'json2csv';

const router = Router();

// List all products for stock management
router.get('/', async (req, res) => {
  const { search } = req.query;
  let where: any = {};
  if (search) {
    where.name = { $like: `%${search}%` };
  }
  const products = await Product.findAll({ where });
  res.render('stock', { products, search: search || '' });
});

// Export products as CSV
router.get('/export', async (req, res) => {
  const products = await Product.findAll();
  const fields = ['name', 'category', 'price', 'stock', 'lowStockThreshold'];
  const opts = { fields };
  try {
    const parser = new Parser(opts);
    const csv = parser.parse(products.map((p: any) => p.toJSON()));
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
  await Product.update({ stock: parseInt(stock) }, { where: { id: req.params.id } });
  const products = await Product.findAll();
  res.render('stock', { products, message: 'Stock updated successfully!' });
});

export default router; 