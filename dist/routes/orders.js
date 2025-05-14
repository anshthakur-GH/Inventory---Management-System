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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
const router = (0, express_1.Router)();
function getProductName(item) {
    if (item && item.productId && typeof item.productId === 'object' && 'name' in item.productId) {
        return item.productId.name;
    }
    return '';
}
// List orders and products
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.default.find();
    const orders = yield Order_1.default.find().populate('items.productId').sort({ orderDate: -1 });
    res.render('orders', {
        products,
        orders: orders.map(order => {
            var _a;
            return ({
                _id: order._id,
                orderDate: order.orderDate.toISOString().slice(0, 10),
                productName: getProductName(order.items[0]),
                quantity: ((_a = order.items[0]) === null || _a === void 0 ? void 0 : _a.quantity) || 0,
                totalAmount: order.totalAmount
            });
        })
    });
}));
// Place a new order and update product stock
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity, discount } = req.body;
    const product = yield Product_1.default.findById(productId);
    if (!product)
        return res.redirect('/orders');
    const qty = parseInt(quantity);
    const disc = parseFloat(discount) || 0;
    const price = product.price;
    const total = (price * qty) - disc;
    yield Order_1.default.create({
        orderDate: new Date(),
        customer: 'Manual',
        items: [{ productId, quantity: qty, price, discount: disc }],
        totalAmount: total,
        status: 'completed'
    });
    product.stock -= qty;
    yield product.save();
    res.redirect('/orders');
}));
exports.default = router;
