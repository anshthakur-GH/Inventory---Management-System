import { Router } from 'express';
import { Product } from '../models/Product';
import { Order, OrderItem } from '../models/Order';
import { Op } from 'sequelize';
const router = Router();

function getProductName(item: any) {
  if (item && item.productId && typeof item.productId === 'object' && 'name' in item.productId) {
    return item.productId.name;
  }
  return '';
}

// List orders and products
router.get('/', async (req, res) => {
  const products = await Product.findAll();
  const orders = await Order.findAll({
    include: [{ model: OrderItem, as: 'items', include: [Product] }],
    order: [['orderDate', 'DESC']]
  });
  res.render('orders', {
    products,
    orders: orders.map(order => {
      const items = (order as any).items as any[];
      return {
        _id: order.id,
        orderDate: order.orderDate.toISOString().slice(0, 10),
        productName: items[0]?.Product?.name || '',
        quantity: items[0]?.quantity || 0,
        totalAmount: order.totalAmount
      };
    })
  });
});

// Place a new order and update product stock
router.post('/', async (req, res) => {
  const { productId, quantity, discount } = req.body;
  const product = await Product.findByPk(productId);
  if (!product) return res.redirect('/orders');
  const qty = parseInt(quantity);
  const disc = parseFloat(discount) || 0;
  const price = product.price;
  const total = (price * qty) - disc;
  const order = await Order.create({
    orderDate: new Date(),
    customer: 'Manual',
    totalAmount: total,
    status: 'completed'
  });
  await OrderItem.create({
    orderId: order.id,
    productId,
    quantity: qty,
    price,
    discount: disc
  });
  product.stock -= qty;
  await product.save();
  res.redirect('/orders');
});

// Add route to update order status
router.post('/status/:id', async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).send('Order not found');
    }
    order.status = status;
    await order.save();
    res.redirect('/orders');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router; 