// import mongoose, { Model, Schema } from 'mongoose';

// class Setting {
//   public schema: Schema;
//   public model: Model<unknown>;
//   static readonly COLLECTION_NAME = 'settings';
//   constructor () {
//     this.generateSchema();
//   }

//   public generateSchema () {
//     this.schema = new Schema({
//       companyName: {
//         type: String,
//       },
//       phoneNumber: {
//         type: String,
//       },
//       email: {
//         type: String,
//       },
//       address: {
//         type: String,
//       },
//       map: {
//         type: String,
//       },
//     },
//     {
//       timestamps: {
//       },
//     },
//     );
//     if (!mongoose.models[Setting.COLLECTION_NAME]) {
//       mongoose.model(Setting.COLLECTION_NAME, this.schema, Setting.COLLECTION_NAME);
//     }
//     this.model = mongoose.model(Setting.COLLECTION_NAME);
//   }
// }

// export default new Setting();

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Setting extends Model {}

Setting.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  map: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  modelName: 'Setting',
  tableName: 'settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Setting;
