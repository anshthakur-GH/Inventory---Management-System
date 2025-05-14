"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderItemSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }
});
const orderSchema = new mongoose_1.Schema({
    orderDate: { type: Date, default: Date.now },
    customer: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'completed' },
    supplier: { type: String, default: '' }
});
exports.default = (0, mongoose_1.model)('Order', orderSchema);
