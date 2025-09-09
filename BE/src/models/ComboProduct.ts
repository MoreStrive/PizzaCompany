import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import Combo from './Combo';
import Product from './Product';

class ComboProduct extends Model {}

ComboProduct.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  combo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Combo, key: 'id' },
    onDelete: 'CASCADE',
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Product, key: 'id' },
    onDelete: 'CASCADE',
  },
  size: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  option: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  toppings: {
    type: DataTypes.JSON,
    allowNull: true,
    get () {
      const rawValue = this.getDataValue('toppings');
      console.log('-=========');
      console.log(JSON.parse(rawValue));
      console.log('-=========');
      try {
        return rawValue ? JSON.parse(rawValue) : null;
      } catch (error) {
        return null;
      }
    },
    set (value) {
      this.setDataValue('toppings', JSON.stringify(value));
    },
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_price: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
}, {
  sequelize,
  modelName: 'ComboProduct',
  tableName: 'combo_products',
  timestamps: false,
});

export default ComboProduct;
