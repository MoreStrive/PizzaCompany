import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import Product from './Product';

class ProductOption extends Model {}

ProductOption.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  option_value: { type: DataTypes.STRING(50), allowNull: false },
  price: { type: DataTypes.DOUBLE, allowNull: false },
}, {
  sequelize,
  modelName: 'ProductOption',
  tableName: 'product_options',
  timestamps: false,
});

export default ProductOption;
