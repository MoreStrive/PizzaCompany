
// import mongoose, { Model, Schema } from 'mongoose';

// class Product {
//     public schema: Schema;
//     public model: Model<unknown>;
//     static readonly COLLECTION_NAME = 'products';
//     static readonly OPTIONS_PRODUCT = 'product';
//     public readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' };

//     constructor () {
//       this.genderate();
//     }

//     public genderate () {
//       this.schema = new Schema({
//         productName: {
//           type: String,
//           default: null,
//         },
//         sizes: [
//           {
//             value: String,
//             price: Number, // giá tiền theo kích cỡ chiếc Pizza
//           },
//         ],
//         options: [
//           {
//             value: String,
//             price: Number, // giá tiền theo các option chiếc Pizza ( ở đây là đế )
//           },
//         ],
//         topings: [
//           {
//             value: String,
//             price: Number, // giá tiền theo các option chiếc Pizza ( ở đây là đế )
//           },
//         ],
//         content: {
//           type: String,
//           default: null,
//         },
//         description: {
//           type: String,
//           default: null,
//         },
//         thumbnail: {
//           type: String,
//           default: null,
//         },
//         categoryCode: {
//           type: String,
//           default: null,
//         },
//         rate: {
//           type: Number,
//           default: 5,
//         },
//         status: {
//           type: String,
//           default: 'inactive',
//           enum: ['active', 'inactive'],
//         },
//         discount: {
//           type: Number,
//           default: 0,
//         },
//         shippingFee: {
//           type: Number,
//           default: 0,
//         },
//         count: {
//           type: Number,
//           default: 0,
//         },
//         isDelete: {
//           type: Boolean,
//           default: false,
//         },
//       }, {
//         timestamps: {
//         },
//       });

//       if (!mongoose.models[Product.COLLECTION_NAME]) {
//         mongoose.model(Product.COLLECTION_NAME, this.schema, Product.COLLECTION_NAME);
//       }
//       this.model = mongoose.model(Product.COLLECTION_NAME);
//     }
// }

// export default new Product();

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import Category from './Category';

class Product extends Model {}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Category, key: 'id' },
    onDelete: 'SET NULL',
  },
  rate: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 5.0,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'inactive',
  },
  discount: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  shipping_fee: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  is_delete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Product;
