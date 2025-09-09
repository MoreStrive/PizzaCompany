// import mongoose, { Model, Schema } from 'mongoose';

// class Category {
//   public schema: Schema;
//   public model: Model<unknown>;
//   static readonly COLLECTION_NAME = 'categories';
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
//       order: Number,
//       slug: {
//         type: String,
//         unique: [true, 'slug đã tồn tại'],
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
//     if (!mongoose.models[Category.COLLECTION_NAME]) {
//       mongoose.model(Category.COLLECTION_NAME, this.schema, Category.COLLECTION_NAME);
//     }
//     this.model = mongoose.model(Category.COLLECTION_NAME);
//   }
// }

// export default new Category();

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Category extends Model {}

Category.init({
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
  order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
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
  modelName: 'Category',
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Category;
