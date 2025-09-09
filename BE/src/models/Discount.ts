// import mongoose, { Model, Schema } from 'mongoose';

// class Discount {
//   public schema: Schema;
//   public model: Model<unknown>;
//   static readonly COLLECTION_NAME = 'discounts';
//   public readonly CONDITION_ENUM = { LEVEL_CUSTOM: 'LEVEL_CUSTOM', ALL: 'ALL', MIN_PRICE: 'MIN_PRICE' };
//   public readonly DISCOUNT_ENUM = { PERCENT: 'percent', CASH: 'cash' };
//   public readonly ERROR_NOTE = { LEVEL_CUSTOM: 'Hạng của bạn chưa đủ để áp dụng mã này', MIN_PRICE: 'Giá trị đơn hàng chưa đủ để áp dụng mã này', EXPIRATION: 'Mã đã hết hạn', MAX_COUNT: 'Mã đã hết!' };
//   constructor () {
//     this.generateSchema();
//   }

//   public generateSchema () {
//     this.schema = new Schema({
//       title: {
//         type: String,
//       },
//       code: {
//         type: String,
//       },
//       count: {
//         type: Number,
//       },
//       thumbnail: {
//         type: String,
//         default: '',
//       },
//       content: {
//         type: String,
//       },
//       condition: {
//         type: String,
//         default: 'ALL',
//         enum: ['LEVEL_CUSTOM', 'ALL', 'MIN_PRICE'],
//       },
//       valueCondition: {
//         type: String || Number,
//       },
//       discount: {
//         type: {
//           type: String,
//           enum: ['percent', 'cash'],
//         },
//         value: Number,
//       },
//       limitOnUser: {
//         type: Number,
//       }, // Số lần sử dụng tối đa cho 1 cá nhân
//       errorNote: {
//         type: String,
//         default: 'ALL',
//       },
//       status: {
//         type: String,
//         default: 'active',
//         enum: ['active', 'inactive', 'over'],
//       },
//       startDate: {
//         type: Date,
//       },
//       expirationDate: {
//         type: Date,
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
//     if (!mongoose.models[Discount.COLLECTION_NAME]) {
//       mongoose.model(Discount.COLLECTION_NAME, this.schema, Discount.COLLECTION_NAME);
//     }
//     this.model = mongoose.model(Discount.COLLECTION_NAME);
//   }
// }

// export default new Discount();

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Discount extends Model {}

Discount.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  condition: {
    type: DataTypes.ENUM('LEVEL_CUSTOM', 'ALL', 'MIN_PRICE'),
    defaultValue: 'ALL',
  },
  value_condition: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  discount_type: {
    type: DataTypes.ENUM('percent', 'cash'),
    allowNull: false,
  },
  discount_value: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  limit_on_user: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  error_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'over'),
    defaultValue: 'active',
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expiration_date: {
    type: DataTypes.DATE,
    allowNull: true,
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
  modelName: 'Discount',
  tableName: 'discounts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Discount;
