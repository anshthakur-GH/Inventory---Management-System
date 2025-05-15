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
const Order_1 = require("../models/Order");
const json2csv_1 = require("json2csv");
const pdfkit_1 = __importDefault(require("pdfkit"));
const router = (0, express_1.Router)();
// Generate reports from database
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, export: exportType } = req.query;
    const where = {};
    if (from)
        where.orderDate = Object.assign(Object.assign({}, (where.orderDate || {})), { $gte: new Date(from) });
    if (to)
        where.orderDate = Object.assign(Object.assign({}, (where.orderDate || {})), { $lte: new Date(to) });
    const orders = yield Order_1.Order.findAll({ where, order: [['orderDate', 'DESC']] });
    const reports = orders.map(order => ({
        date: order.orderDate.toISOString().slice(0, 10),
        type: order.status === 'purchase' ? 'Purchase' : 'Sale',
        details: `Order #${order.id}`,
        amount: order.totalAmount
    }));
    if (exportType === 'csv') {
        const fields = ['date', 'type', 'details', 'amount'];
        const opts = { fields };
        try {
            const parser = new json2csv_1.Parser(opts);
            const csv = parser.parse(reports);
            res.header('Content-Type', 'text/csv');
            res.attachment('reports.csv');
            return res.send(csv);
        }
        catch (err) {
            return res.status(500).send('Could not export CSV');
        }
    }
    else if (exportType === 'pdf') {
        const doc = new pdfkit_1.default();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reports.pdf');
        doc.pipe(res);
        doc.fontSize(18).text('Reports', { align: 'center' });
        doc.moveDown();
        reports.forEach(r => {
            doc.fontSize(12).text(`Date: ${r.date} | Type: ${r.type} | Details: ${r.details} | Amount: ${r.amount}`);
        });
        doc.end();
        return;
    }
    res.render('reports', { reports });
}));
exports.default = router;
