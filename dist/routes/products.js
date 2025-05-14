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
const router = (0, express_1.Router)();
// List products with search and filter
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, category } = req.query;
    const query = {};
    if (search)
        query.name = { $regex: search, $options: 'i' };
    if (category)
        query.category = category;
    const products = yield Product_1.default.find(query);
    const categories = yield Product_1.default.distinct('category');
    res.render('products', { products, categories });
}));
// Show add product form
router.get('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Product_1.default.distinct('category');
    res.render('addProduct', { categories });
}));
// Handle add product
router.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, price, stock, image, lowStockThreshold } = req.body;
    yield Product_1.default.create({ name, category, price, stock, image, lowStockThreshold });
    res.redirect('/products');
}));
// Show edit product form
router.get('/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findById(req.params.id);
    const categories = yield Product_1.default.distinct('category');
    res.render('editProduct', { product, categories });
}));
// Handle edit product
router.post('/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, price, stock, image, lowStockThreshold } = req.body;
    yield Product_1.default.findByIdAndUpdate(req.params.id, { name, category, price, stock, image, lowStockThreshold });
    res.redirect('/products');
}));
// Handle delete product
router.post('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Product_1.default.findByIdAndDelete(req.params.id);
    res.redirect('/products');
}));
exports.default = router;
