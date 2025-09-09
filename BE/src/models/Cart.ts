// import mongoose, { Model, Schema } from 'mongoose';

// class Cart {
//     public schema: Schema;
//     public model: Model<unknown>;
//     static readonly COLLECTION_NAME = 'carts';
//     public readonly PRODUCT_TYPE_ENUM = { PRODUCT: 'PRODUCT', COMBO: 'COMBO' };

//     constructor () {
//       this.genderate();
//     }

//     public genderate () {
//       this.schema = new Schema({
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//         },
//         productIds: [{
//           id: String,
//           value: mongoose.Schema.Types.ObjectId,
//           type: {
//             type: String,
//             default: 'PRODUCT',
//             enum: ['PRODUCT', 'COMBO'],
//           },
//           size: String,
//           option: String,
//           topings: [],
//           count: Number,
//           totalPrice: {
//             type: Number,
//             default: 0,
//           },
//         }],
//         isDelete: {
//           type: Boolean,
//           default: false,
//         },
//       }, {
//         timestamps: {
//         },
//       });

//       if (!mongoose.models[Cart.COLLECTION_NAME]) {
//         mongoose.model(Cart.COLLECTION_NAME, this.schema, Cart.COLLECTION_NAME);
//       }
//       this.model = mongoose.model(Cart.COLLECTION_NAME);
//     }

//     public getProductPrice (product: any, item: any) {
//       const priceOfSize = product.sizes?.find((_size : any) => _size?.value === item?.size)?.price || 0;
//       const priceOfOption = product.options?.find((_options : any) => _options?.value === item?.option)?.price || 0;
//       const discount = product.discount;

//       let topingPrice = 0;
//       if (item && item.topings) {
//         item.topings.map((toping : any) => {
//           const result = product.topings && product.topings.find((element : any) => element.value === toping);
//           if (result) {
//             topingPrice += result.price;
//           } else {
//             topingPrice += 0;
//           }
//           return toping;
//         });
//       }

//       const totalPrice = priceOfSize + priceOfOption + topingPrice;
//       return discount ? totalPrice - ((totalPrice / 100) * discount) : totalPrice;
//     }

//     public getComboPrice (combo: any) {
//       const totalPrice = combo.totalPrice;
//       const discount = combo.discount;
//       return discount ? totalPrice - ((totalPrice / 100) * discount) : totalPrice;
//     }
// }

// export default new Cart();

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import User from './User';

class Cart extends Model {}

Cart.init({
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
  modelName: 'Cart',
  tableName: 'carts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Cart;
