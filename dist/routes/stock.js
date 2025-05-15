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
const json2csv_1 = require("json2csv");
const router = (0, express_1.Router)();
// List all products for stock management
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    let where = {};
    if (search) {
        where.name = { $like: `%${search}%` };
    }
    const products = yield Product_1.Product.findAll({ where });
    res.render('stock', { products, search: search || '' });
}));
// Export products as CSV
router.get('/export', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.Product.findAll();
    const fields = ['name', 'category', 'price', 'stock', 'lowStockThreshold'];
    const opts = { fields };
    try {
        const parser = new json2csv_1.Parser(opts);
        const csv = parser.parse(products.map((p) => p.toJSON()));
        res.header('Content-Type', 'text/csv');
        res.attachment('products.csv');
        res.send(csv);
    }
    catch (err) {
        res.status(500).send('Could not export CSV');
    }
}));
// Adjust stock for a product
router.post('/adjust/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stock } = req.body;
    yield Product_1.Product.update({ stock: parseInt(stock) }, { where: { id: req.params.id } });
    const products = yield Product_1.Product.findAll();
    res.render('stock', { products, message: 'Stock updated successfully!' });
}));
exports.default = router;
