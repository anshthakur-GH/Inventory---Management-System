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
const sequelize_1 = require("sequelize");
const router = (0, express_1.Router)();
// List products with search and filter
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, category } = req.query;
    const where = {};
    if (search)
        where.name = { [sequelize_1.Op.like]: `%${search}%` };
    if (category)
        where.category = category;
    const products = yield Product_1.Product.findAll({ where });
    // Get distinct categories
    const allProducts = yield Product_1.Product.findAll();
    const categories = Array.from(new Set(allProducts.map(p => p.category)));
    res.render('products', { products, categories });
}));
// Show add product form
router.get('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allProducts = yield Product_1.Product.findAll();
    const categories = Array.from(new Set(allProducts.map(p => p.category)));
    res.render('addProduct', { categories });
}));
// Handle add product
router.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, price, stock, image, lowStockThreshold } = req.body;
    yield Product_1.Product.create({ name, category, price, stock, image, lowStockThreshold });
    res.redirect('/products');
}));
// Show edit product form
router.get('/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.Product.findByPk(req.params.id);
    const allProducts = yield Product_1.Product.findAll();
    const categories = Array.from(new Set(allProducts.map(p => p.category)));
    res.render('editProduct', { product, categories });
}));
// Handle edit product
router.post('/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, price, stock, image, lowStockThreshold } = req.body;
    yield Product_1.Product.update({ name, category, price, stock, image, lowStockThreshold }, { where: { id: req.params.id } });
    res.redirect('/products');
}));
// Handle delete product
router.post('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Product_1.Product.destroy({ where: { id: req.params.id } });
    res.redirect('/products');
}));
exports.default = router;
