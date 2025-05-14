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
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalProducts = yield Product_1.default.countDocuments();
    const totalUsers = yield User_1.default.countDocuments();
    const categories = yield Product_1.default.distinct('category');
    const totalCategories = categories.length;
    // No Supplier model, so use 0 as placeholder
    const totalSuppliers = 0;
    const totalCustomers = 0;
    // Total Purchase and Outgoing from Order
    const totalPurchase = yield Order_1.default.countDocuments({ status: 'purchase' });
    const totalOutgoing = yield Order_1.default.countDocuments({ status: 'completed' });
    // For chart: get product names and stock
    const products = yield Product_1.default.find({}, 'name stock');
    // Product list for dashboard table
    const productList = yield Product_1.default.find({}, 'name price stock image category');
    // Find product with lowest stock
    const lowStockProduct = yield Product_1.default.findOne().sort({ stock: 1 });
    // Find winner product (most sold)
    const orders = yield Order_1.default.find({ 'items.0': { $exists: true } });
    const salesMap = {};
    for (const order of orders) {
        for (const item of order.items) {
            const key = String(item.productId);
            if (!salesMap[key]) {
                // Get product name
                const prod = yield Product_1.default.findById(item.productId);
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
