// import mongoose, { Model, Schema } from 'mongoose';

// class Rating {
//   public schema: Schema;
//   public model: Model<unknown>;
//   static readonly COLLECTION_NAME = 'ratings';

//   constructor () {
//     this.generateSchema();
//   }

//   public generateSchema () {
//     this.schema = new Schema({
//       user: {},
//       productId: {
//         type: String,
//       },
//       rating: {
//         type: Number,
//       },
//       content: {
//         type: String,
//       },
//       status: {
//         type: String,
//         default: 'active',
//         enum: ['active', 'inactive'],
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
//     if (!mongoose.models[Rating.COLLECTION_NAME]) {
//       mongoose.model(Rating.COLLECTION_NAME, this.schema, Rating.COLLECTION_NAME);
//     }
//     this.model = mongoose.model(Rating.COLLECTION_NAME);
//   }
// }

// export default new Rating();

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import User from './User';
import Product from './Product';

class Rating extends Model {}

Rating.init({
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
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Product, key: 'id' },
    onDelete: 'CASCADE',
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
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
  modelName: 'Rating',
  tableName: 'ratings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Rating;
