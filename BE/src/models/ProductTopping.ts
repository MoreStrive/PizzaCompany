import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import Product from './Product';

class ProductTopping extends Model {}

ProductTopping.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  topping_value: { type: DataTypes.STRING(50), allowNull: false },
  price: { type: DataTypes.DOUBLE, allowNull: false },
}, {
  sequelize,
  modelName: 'ProductTopping',
  tableName: 'product_toppings',
  timestamps: false,
});

export default ProductTopping;
