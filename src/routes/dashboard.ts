import { Router } from 'express';
import { Product } from '../models/Product';
import { Order, OrderItem } from '../models/Order';
import { User } from '../models/User';
const router = Router();

router.get('/', async (req, res) => {
  const totalProducts = await Product.count();
  const totalUsers = await User.count();
  const allProducts = await Product.findAll();
  const categories = Array.from(new Set(allProducts.map(p => p.category)));
  const totalCategories = categories.length;
  // No Supplier model, so use 0 as placeholder
  const totalSuppliers = 0;
  // Total Purchase and Outgoing from Order
  const totalPurchase = await Order.count({ where: { status: 'purchase' } });
  const totalOutgoing = await Order.count({ where: { status: 'completed' } });
  // For chart: get product names and stock
  const products = await Product.findAll({ attributes: ['name', 'stock'] });

  // Product list for dashboard table
  const productList = await Product.findAll({ attributes: ['id', 'name', 'price', 'stock', 'image', 'category'] });

  // Find product with lowest stock
  const lowStockProduct = await Product.findOne({ order: [['stock', 'ASC']] });

  // Find winner product (most sold)
  const orders = await Order.findAll({ include: [{ model: OrderItem, as: 'items' }] });
  const salesMap: Record<string, { name: string; sold: number }> = {};
  for (const order of orders) {
    for (const item of (order as any).items) {
      const prod = await Product.findByPk(item.productId);
      const key = String(item.productId);
      if (!salesMap[key]) {
        salesMap[key] = { name: prod ? prod.name : 'Unknown', sold: 0 };
      }
      salesMap[key].sold += item.quantity;
    }
  }
  let winnerProduct = null;
  for (const id in salesMap) {
    if (!winnerProduct || salesMap[id].sold > winnerProduct.sold) {
      winnerProduct = { name: salesMap[id].name, sold: salesMap[id].sold };
    }
  }

  res.render('dashboard', {
    totalProducts,
    totalCategories,
    totalSuppliers,
    lowStockProduct,
    winnerProduct,
    productList
  });
});

export default router; 