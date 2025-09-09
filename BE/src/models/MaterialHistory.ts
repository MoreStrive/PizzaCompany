// import mongoose, { Model, Schema } from 'mongoose';

// class MaterialHistory {
//   public schema: Schema;
//   public model: Model<unknown>;
//   static readonly COLLECTION_NAME = 'material-histories';
//   constructor () {
//     this.generateSchema();
//   }

//   public generateSchema () {
//     this.schema = new Schema({
//       staffId: mongoose.Schema.Types.ObjectId,
//       materialId: mongoose.Schema.Types.ObjectId,
//       content: {
//         type: String,
//       },
//       quantity: {
//         type: Number,
//       },
//       unit: {
//         type: String,
//         enum: ['gam', 'ml'],
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
//     if (!mongoose.models[MaterialHistory.COLLECTION_NAME]) {
//       mongoose.model(MaterialHistory.COLLECTION_NAME, this.schema, MaterialHistory.COLLECTION_NAME);
//     }
//     this.model = mongoose.model(MaterialHistory.COLLECTION_NAME);
//   }
// }

// export default new MaterialHistory();

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import Material from './Material';
import StaffSystem from './StaffSystem';

class MaterialHistory extends Model {}

MaterialHistory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  staff_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: StaffSystem, key: 'id' },
    onDelete: 'CASCADE',
  },
  material_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Material, key: 'id' },
    onDelete: 'CASCADE',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  unit: {
    type: DataTypes.ENUM('gam', 'ml'),
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
  modelName: 'MaterialHistory',
  tableName: 'material_histories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default MaterialHistory;
