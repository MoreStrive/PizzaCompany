// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import mongoose, { Model, Schema } from 'mongoose';
// import settings from '@configs/settings';

// class StaffSystem {
//     public schema: Schema;
//     public model: Model<unknown>;
//     static readonly COLLECTION_NAME = 'staffs-system';

//     public readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive', PENDING: 'pending', LAY_OFF: 'layoff' };
//     public readonly GENDER_ENUM = { MALE: 'male', FEMALE: 'female', ORTHER: 'orther' };
//     public readonly ROLE_ENUM = { ADMIN: 'ADMIN', MANAGE: 'MANAGE', STAFF: 'STAFF' };
//     public readonly CREATABLE_PARAMETERS = ['fullName', 'email', 'phoneNumber', 'password', 'avatar', 'gender', 'address']
//     public readonly UPDATABLE_PARAMETERS = ['fullName', 'email', 'status', 'phoneNumber', 'password', 'avatar', 'gender', 'address']
//     public readonly ADMIN_UPDATABLE_PARAMETERS = ['fullName', 'email', 'phoneNumber', 'password', 'avatar', 'status', 'role', 'salary', 'gender', 'address', 'joinDate']
//     public readonly ADMIN_CREATE_PARAMETERS = ['username', 'fullName', 'email', 'phoneNumber', 'password', 'status', 'avatar', 'role', 'salary', 'gender', 'address', 'joinDate']

//     constructor () {
//       this.genderate();
//     }

//     public genderate () {
//       this.schema = new Schema({
//         username: {
//           type: String,
//           required: true,
//           unique: true,
//         },
//         email: {
//           type: String,
//           required: true,
//           unique: true,
//         },
//         password: {
//           type: String,
//           required: true,
//         },
//         phoneNumber: {
//           type: String,
//           required: true,
//           unique: true,
//         },
//         fullName: {
//           type: String,
//           required: true,
//         },
//         avatar: {
//           type: String,
//           default: '',
//         },
//         gender: {
//           type: String,
//           enum: ['male', 'female', 'orther'],
//           default: 'male',
//         },
//         dateOfBirth: {
//           type: Date,
//         },
//         role: {
//           type: String,
//           enum: ['ADMIN', 'MANAGE', 'STAFF'],
//           default: 'StaffSystem',
//         },
//         joinDate: {
//           type: Date,
//         },
//         salary: {
//           type: Number,
//         },
//         status: {
//           type: String,
//           enum: ['active', 'inactive', 'pending', 'layoff'],
//           default: 'inactive',
//         },
//         address: {
//           type: String,
//         },
//         isVerify: {
//           type: Boolean,
//           default: false,
//         },
//         isDelete: {
//           type: Boolean,
//           default: false,
//         },
//       }, {
//         timestamps: {
//         },
//       });
//       this.schema.pre('save', async function save (next: any) {
//         if (!this.isModified('password')) return next();
//         try {
//           const salt = await bcrypt.genSaltSync(10);
//           this.password = await bcrypt.hash(this.password, salt);
//           return next();
//         } catch (err) {
//           return next(err);
//         }
//       });

//       if (!mongoose.models[StaffSystem.COLLECTION_NAME]) {
//         mongoose.model(StaffSystem.COLLECTION_NAME, this.schema, StaffSystem.COLLECTION_NAME);
//       }
//       this.model = mongoose.model(StaffSystem.COLLECTION_NAME);
//     }

//     public async validPassword (password: string, passwordHashed: string) {
//       try {
//         return await bcrypt.compare(password, passwordHashed);
//       } catch (error) {
//         return false;
//       }
//     }

//     public async generateAccessToken (id: string) {
//       const token = jwt.sign({ id }, settings.jwt.secret, { expiresIn: settings.jwt.ttl });
//       return token;
//     };
// }

// export default new StaffSystem();

import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from '../database';
import settings from '../configs/settings';

class StaffSystem extends Model {
  public static async hashPassword (password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Hàm kiểm tra mật khẩu
  public async validPassword (password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Hàm tạo Access Token
  public async generateAccessToken (id: string): Promise<string> {
    return jwt.sign({ id }, settings.jwt.secret, { expiresIn: settings.jwt.ttl });
  }
}

StaffSystem.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'orther'),
    defaultValue: 'male',
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'MANAGE', 'STAFF'),
    defaultValue: 'STAFF',
  },
  join_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  salary: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending', 'layoff'),
    defaultValue: 'inactive',
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  modelName: 'StaffSystem',
  tableName: 'staff_system',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default StaffSystem;
