import { Router } from 'express';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
const router = Router();

router.get('/', async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();
  const categories = await Product.distinct('category');
  const totalCategories = categories.length;
  // No Supplier model, so use 0 as placeholder
  const totalSuppliers = 0;
  const totalCustomers = 0;
  // Total Purchase and Outgoing from Order
  const totalPurchase = await Order.countDocuments({ status: 'purchase' });
  const totalOutgoing = await Order.countDocuments({ status: 'completed' });
  // For chart: get product names and stock
  const products = await Product.find({}, 'name stock');

  // Product list for dashboard table
  const productList = await Product.find({}, 'name price stock image category');

  // Find product with lowest stock
  const lowStockProduct = await Product.findOne().sort({ stock: 1 });

  // Find winner product (most sold)
  const orders = await Order.find({ 'items.0': { $exists: true } });
  const salesMap: Record<string, { name: string; sold: number }> = {};
  for (const order of orders) {
    for (const item of order.items) {
      const key = String(item.productId);
      if (!salesMap[key]) {
        // Get product name
        const prod = await Product.findById(item.productId);
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