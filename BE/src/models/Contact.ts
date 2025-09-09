// import mongoose, { Model, Schema } from 'mongoose';

// class Contact {
//   public schema: Schema;
//   public model: Model<unknown>;
//   static readonly COLLECTION_NAME = 'contacts';
//   constructor () {
//     this.generateSchema();
//   }

//   public generateSchema () {
//     this.schema = new Schema({
//       fullname: {
//         type: String,
//       },
//       phoneNumber: {
//         type: String,
//       },
//       email: {
//         type: String,
//       },
//       content: {
//         type: String,
//       },
//       status: {
//         type: String,
//         default: 'unProcessed',
//         enum: ['processed', 'unProcessed'],
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
//     if (!mongoose.models[Contact.COLLECTION_NAME]) {
//       mongoose.model(Contact.COLLECTION_NAME, this.schema, Contact.COLLECTION_NAME);
//     }
//     this.model = mongoose.model(Contact.COLLECTION_NAME);
//   }
// }

// export default new Contact();

import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

class Contact extends Model {}

Contact.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullname: {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('processed', 'unProcessed'),
    defaultValue: 'unProcessed',
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
  modelName: 'Contact',
  tableName: 'contacts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Contact;
