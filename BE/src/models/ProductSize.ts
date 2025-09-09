import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import Product from './Product';

class ProductSize extends Model {}

ProductSize.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  size_value: { type: DataTypes.STRING(50), allowNull: false },
  price: { type: DataTypes.DOUBLE, allowNull: false },
}, {
  sequelize,
  modelName: 'ProductSize',
  tableName: 'product_sizes',
  timestamps: false,
});

export default ProductSize;
