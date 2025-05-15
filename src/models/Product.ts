import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export class Product extends Model {
  public id!: number;
  public name!: string;
  public category!: string;
  public price!: number;
  public stock!: number;
  public image?: string;
  public lowStockThreshold!: number;
}

Product.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
}, {
  sequelize,
  tableName: 'products',
}); 