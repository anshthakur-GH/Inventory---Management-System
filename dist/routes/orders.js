"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Product_1 = require("../models/Product");
const Order_1 = require("../models/Order");
const router = (0, express_1.Router)();
function getProductName(item) {
    if (item && item.productId && typeof item.productId === 'object' && 'name' in item.productId) {
        return item.productId.name;
    }
    return '';
}
// List orders and products
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.Product.findAll();
    const orders = yield Order_1.Order.findAll({
        include: [{ model: Order_1.OrderItem, as: 'items', include: [Product_1.Product] }],
        order: [['orderDate', 'DESC']]
    });
    res.render('orders', {
        products,
        orders: orders.map(order => {
            var _a, _b, _c;
            return ({
                _id: order.id,
                orderDate: order.orderDate.toISOString().slice(0, 10),
                productName: ((_b = (_a = order.items[0]) === null || _a === void 0 ? void 0 : _a.Product) === null || _b === void 0 ? void 0 : _b.name) || '',
                quantity: ((_c = order.items[0]) === null || _c === void 0 ? void 0 : _c.quantity) || 0,
                totalAmount: order.totalAmount
            });
        })
    });
}));
// Place a new order and update product stock
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity, discount } = req.body;
    const product = yield Product_1.Product.findByPk(productId);
    if (!product)
        return res.redirect('/orders');
    const qty = parseInt(quantity);
    const disc = parseFloat(discount) || 0;
    const price = product.price;
    const total = (price * qty) - disc;
    const order = yield Order_1.Order.create({
        orderDate: new Date(),
        customer: 'Manual',
        totalAmount: total,
        status: 'completed'
    });
    yield Order_1.OrderItem.create({
        orderId: order.id,
        productId,
        quantity: qty,
        price,
        discount: disc
    });
    product.stock -= qty;
    yield product.save();
    res.redirect('/orders');
}));
exports.default = router;
