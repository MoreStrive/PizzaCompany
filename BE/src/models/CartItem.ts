import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import Cart from './Cart';
import Product from './Product';
import Combo from './Combo';

class CartItem extends Model {}

CartItem.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Cart, key: 'id' },
    onDelete: 'CASCADE',
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: Product, key: 'id' },
    onDelete: 'SET NULL',
  },
  combo_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: Combo, key: 'id' },
    onDelete: 'SET NULL',
  },
  type: {
    type: DataTypes.ENUM('PRODUCT', 'COMBO'),
    defaultValue: 'PRODUCT',
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
    defaultValue: 1,
  },
  total_price: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
}, {
  sequelize,
  modelName: 'CartItem',
  tableName: 'cart_items',
  timestamps: false,
});

export default CartItem;
