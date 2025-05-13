import { Schema, model, Document, Types } from 'mongoose';

interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  discount: number;
}

export interface IOrder extends Document {
  orderDate: Date;
  customer: string;
  items: IOrderItem[];
  totalAmount: number;
  status: string;
  supplier?: string;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }
});

const orderSchema = new Schema<IOrder>({
  orderDate: { type: Date, default: Date.now },
  customer: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'completed' },
  supplier: { type: String, default: '' }
});

export default model<IOrder>('Order', orderSchema); 