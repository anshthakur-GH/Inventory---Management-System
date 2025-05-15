import { Router } from 'express';
import { Order } from '../models/Order';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
const router = Router();

// Generate reports from database
router.get('/', async (req, res) => {
  const { from, to, export: exportType } = req.query;
  const where: any = {};
  if (from) where.orderDate = { ...(where.orderDate || {}), $gte: new Date(from as string) };
  if (to) where.orderDate = { ...(where.orderDate || {}), $lte: new Date(to as string) };
  const orders = await Order.findAll({ where, order: [['orderDate', 'DESC']] });
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
      const parser = new Parser(opts);
      const csv = parser.parse(reports);
      res.header('Content-Type', 'text/csv');
      res.attachment('reports.csv');
      return res.send(csv);
    } catch (err) {
      return res.status(500).send('Could not export CSV');
    }
  } else if (exportType === 'pdf') {
    const doc = new PDFDocument();
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
});

export default router; 