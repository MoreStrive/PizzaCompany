// import mongoose, { Model, Schema } from 'mongoose';

// class Combo {
//     public schema: Schema;
//     public model: Model<unknown>;
//     static readonly COLLECTION_NAME = 'combos';

//     constructor () {
//       this.genderate();
//     }

//     public genderate () {
//       this.schema = new Schema({
//         title: {
//           type: String,
//           default: null,
//         },
//         thumbnail: String,
//         content: String,
//         discount: {
//           type: Number,
//           default: 0,
//         }, // theo phần trăm
//         count: {
//           type: Number,
//           default: 0,
//         },
//         productIds: [{
//           id: String,
//           value: mongoose.Schema.Types.ObjectId,
//           size: String,
//           option: String,
//           topings: [],
//           totalPrice: {
//             type: Number,
//             default: 0,
//           },
//           count: Number,
//         }],
//         totalPrice: {
//           type: Number,
//           default: 0,
//         },
//         finalPrice: {
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

//       if (!mongoose.models[Combo.COLLECTION_NAME]) {
//         mongoose.model(Combo.COLLECTION_NAME, this.schema, Combo.COLLECTION_NAME);
//       }
//       this.model = mongoose.model(Combo.COLLECTION_NAME);
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
// }

// export default new Combo();
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Combo extends Model {}

Combo.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.0,
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_price: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  final_price: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'inactive',
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
  modelName: 'Combo',
  tableName: 'combos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Combo;
