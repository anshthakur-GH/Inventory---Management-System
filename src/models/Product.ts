import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  lowStockThreshold: number;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String },
  lowStockThreshold: { type: Number, default: 10 }
});

export default model<IProduct>('Product', productSchema); 