// import mongoose, { Model, Schema } from 'mongoose';

// class Orders {
//   public schema: Schema;
//   public model: Model<unknown>;
//   static readonly COLLECTION_NAME = 'orders';

//   public readonly ORDER_TYPE_ENUM = { PRODUCT: 'PRODUCT', COMBO: 'COMBO' };
//   public readonly PAYMENT_METHOD_ENUM = { CASH: 'cash', PAYMENT: 'payment' };
//   public readonly CREATE_BY_ENUM = { STAFF_SYSTEM: 'STAFF_SYSTEM', USER: 'USER' }
//   public readonly STATUS_ENUM = {
//     DENIED: 'denied',
//     COOKING: 'cooking',
//     REJECT: 'reject',
//     ACCEPT: 'accept',
//     SUCCESS: 'success',
//     DELIVERING: 'delivering',
//     PENDING: 'pending',
//     DRAFT: 'draft',
//   };

//   constructor () {
//     this.generateSchema();
//   }

//   public generateSchema () {
//     this.schema = new Schema({
//       userId: {
//         type: mongoose.Schema.Types.ObjectId,
//       },
//       status: {
//         type: String,
//         default: 'pending',
//         enum: ['denied', 'cooking', 'reject', 'accept', 'success', 'delivering', 'pending', 'draft'],
//       },
//       shippingFee: {
//         type: Number,
//         default: 0,
//       },
//       totalPrice: {
//         type: Number,
//         default: 0,
//       },
//       finalPrice: {
//         type: Number,
//         default: 0,
//       },
//       discount: {},
//       createBy: {
//         type: String,
//         default: 'USER',
//         enum: ['USER', 'STAFF_SYSTEM'],
//       },
//       shippingInfor: {
//         shippingName: {
//           type: String,
//         },
//         shippingPhone: {
//           type: String,
//         },
//         shippingAddress: {
//           type: String,
//         },
//         shippingEmail: {
//           type: String,
//         },
//         note: {
//           type: String,
//         },
//       },
//       orderItems: [{
//         id: String,
//         value: mongoose.Schema.Types.ObjectId,
//         type: {
//           type: String,
//           default: 'PRODUCT',
//           enum: ['PRODUCT', 'COMBO'],
//         },
//         size: String,
//         option: String,
//         topings: [],
//         count: Number,
//         totalPrice: {
//           type: Number,
//           default: 0,
//         },
//       }],
//       paymentMethod: {
//         type: String,
//         default: 'cash',
//         enum: ['cash', 'payment'],
//       },
//       paid: {
//         type: Boolean,
//         default: false,
//       },
//       paymentConfirmation: {
//         type: String,
//         default: '',
//       },
//       isDelete: {
//         type: Boolean,
//         default: false,
//       },
//     },
//     {
//       timestamps: {
//       },
//     },
//     );
//     if (!mongoose.models[Orders.COLLECTION_NAME]) {
//       mongoose.model(Orders.COLLECTION_NAME, this.schema, Orders.COLLECTION_NAME);
//     }
//     this.model = mongoose.model(Orders.COLLECTION_NAME);
//   }

//   public getProductPrice (product: any, item: any) {
//     const priceOfSize = product.sizes?.find((_size : any) => _size?.value === item?.size)?.price || 0;
//     const priceOfOption = product.options?.find((_options : any) => _options?.value === item?.option)?.price || 0;
//     const discount = product.discount;

//     let topingPrice = 0;
//     if (item && item.topings) {
//       item.topings.map((toping : any) => {
//         const result = product.topings && product.topings.find((element : any) => element.value === toping);
//         if (result) {
//           topingPrice += result.price;
//         } else {
//           topingPrice += 0;
//         }
//         return toping;
//       });
//     }

//     const totalPrice = priceOfSize + priceOfOption + topingPrice;
//     return discount ? totalPrice - ((totalPrice / 100) * discount) : totalPrice;
//   }

//   public getComboPrice (combo: any) {
//     const totalPrice = combo.totalPrice;
//     const discount = combo.discount;
//     return discount ? totalPrice - ((totalPrice / 100) * discount) : totalPrice;
//   }
// }

// export default new Orders();

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import User from './User';
import Discount from './Discount';

class Order extends Model {}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.ENUM('denied', 'cooking', 'reject', 'accept', 'success', 'delivering', 'pending', 'draft'),
    defaultValue: 'pending',
  },
  shipping_fee: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  total_price: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  final_price: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  discount_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: Discount, key: 'id' },
    onDelete: 'SET NULL',
  },
  create_by: {
    type: DataTypes.ENUM('USER', 'STAFF_SYSTEM'),
    defaultValue: 'USER',
  },
  shipping_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  shipping_phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  shipping_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  shipping_email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  shipping_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'payment'),
    defaultValue: 'cash',
  },
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  payment_confirmation: {
    type: DataTypes.STRING(255),
    defaultValue: '',
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
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Order;
