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
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalProducts = yield Product_1.Product.count();
    const totalUsers = yield User_1.User.count();
    const allProducts = yield Product_1.Product.findAll();
    const categories = Array.from(new Set(allProducts.map(p => p.category)));
    const totalCategories = categories.length;
    // No Supplier model, so use 0 as placeholder
    const totalSuppliers = 0;
    // Total Purchase and Outgoing from Order
    const totalPurchase = yield Order_1.Order.count({ where: { status: 'purchase' } });
    const totalOutgoing = yield Order_1.Order.count({ where: { status: 'completed' } });
    // For chart: get product names and stock
    const products = yield Product_1.Product.findAll({ attributes: ['name', 'stock'] });
    // Product list for dashboard table
    const productList = yield Product_1.Product.findAll({ attributes: ['id', 'name', 'price', 'stock', 'image', 'category'] });
    // Find product with lowest stock
    const lowStockProduct = yield Product_1.Product.findOne({ order: [['stock', 'ASC']] });
    // Find winner product (most sold)
    const orders = yield Order_1.Order.findAll({ include: [{ model: Order_1.OrderItem, as: 'items' }] });
    const salesMap = {};
    for (const order of orders) {
        for (const item of order.items) {
            const prod = yield Product_1.Product.findByPk(item.productId);
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
}));
exports.default = router;
