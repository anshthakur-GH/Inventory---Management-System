import { Router } from 'express';
import Product from '../models/Product';
import Order from '../models/Order';
const router = Router();

function getProductName(item: any) {
  if (item && item.productId && typeof item.productId === 'object' && 'name' in item.productId) {
    return item.productId.name;
  }
  return '';
}

// List orders and products
router.get('/', async (req, res) => {
  const products = await Product.find();
  const orders = await Order.find().populate('items.productId').sort({ orderDate: -1 });
  res.render('orders', {
    products,
    orders: orders.map(order => ({
      _id: order._id,
      orderDate: order.orderDate.toISOString().slice(0, 10),
      productName: getProductName(order.items[0]),
      quantity: order.items[0]?.quantity || 0,
      totalAmount: order.totalAmount
    }))
  });
});

// Place a new order and update product stock
router.post('/', async (req, res) => {
  const { productId, quantity, discount } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.redirect('/orders');
  const qty = parseInt(quantity);
  const disc = parseFloat(discount) || 0;
  const price = product.price;
  const total = (price * qty) - disc;
  await Order.create({
    orderDate: new Date(),
    customer: 'Manual',
    items: [{ productId, quantity: qty, price, discount: disc }],
    totalAmount: total,
    status: 'completed'
  });
  product.stock -= qty;
  await product.save();
  res.redirect('/orders');
});

export default router; 