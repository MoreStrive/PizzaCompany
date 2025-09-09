// import mongoose, { Model, Schema } from 'mongoose';

// class Material {
//   public schema: Schema;
//   public model: Model<unknown>;
//   static readonly COLLECTION_NAME = 'materials';
//   constructor () {
//     this.generateSchema();
//   }

//   public generateSchema () {
//     this.schema = new Schema({
//       title: {
//         type: String,
//       },
//       thumbnail: {
//         type: String,
//       },
//       code: {
//         type: String,
//         unique: [true, 'slug đã tồn tại'],
//       },
//       quantity: {
//         type: Number,
//       },
//       unit: {
//         type: String,
//         enum: ['gam', 'ml'],
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
//     if (!mongoose.models[Material.COLLECTION_NAME]) {
//       mongoose.model(Material.COLLECTION_NAME, this.schema, Material.COLLECTION_NAME);
//     }
//     this.model = mongoose.model(Material.COLLECTION_NAME);
//   }
// }

// export default new Material();

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Material extends Model {}

Material.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  code: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  unit: {
    type: DataTypes.ENUM('gam', 'ml'),
    allowNull: false,
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
  modelName: 'Material',
  tableName: 'materials',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Material;
