// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import mongoose, { Model, Schema } from 'mongoose'; // thư viện của mongodab danh cho nodejs
// import settings from '@configs/settings';
// class User {
//     public schema: Schema;
//     public model: Model<unknown>;
//     static readonly COLLECTION_NAME = 'users';

//     public readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive', PENDING: 'pending' };
//     public readonly GENDER_ENUM = { MALE: 'male', FEMALE: 'female', ORTHER: 'orther' };
//     public readonly CUSTOMER_CLASS_ENUM = { BRONZE: 'Bronze', SILVER: 'Silver', GOLD: 'Gold', DIAMOND: 'Diamond' };
//     public readonly CUSTOMER_CLASS__CONDITION_ENUM = { SILVER: 2000000, GOLD: 5000000, DIAMOND: 10000000 };

//     public readonly CREATABLE_PARAMETERS = ['username', 'fullName', 'email', 'phoneNumber', 'password', 'avatar', 'acceptPolicy', 'status', 'gender', 'address']
//     public readonly UPDATABLE_PARAMETERS = ['fullName', 'phoneNumber', 'password', 'avatar', 'acceptPolicy', 'gender', 'address']

//     public readonly ADMIN_UPDATABLE_PARAMETERS = ['fullName', 'phoneNumber', 'password', 'avatar', 'acceptPolicy', 'customerClass', 'accumulatedPoint', 'status', 'gender', 'address']
//     public readonly ADMIN_CREATABLE_PARAMETERS = ['username', 'fullName', 'email', 'phoneNumber', 'password', 'avatar', 'acceptPolicy', 'status', 'gender', 'address']

//     constructor () {
//       this.genderateUsers();
//     }

//     public genderateUsers () {
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
//         acceptPolicy: {
//           type: Boolean,
//           default: false,
//         },
//         role: {
//           type: String,
//           enum: ['USER'],
//           default: 'USER',
//         },
//         cartId: {
//           type: mongoose.Schema.Types.ObjectId,
//         },
//         accumulatedPoint: {
//           type: Number,
//           default: 0,
//         },
//         customerClass: {
//           type: String,
//           enum: ['Bronze', 'Silver', 'Gold', 'Diamond'],
//           default: 'Bronze',
//         },
//         isVerify: {
//           type: Boolean,
//           default: false,
//         },
//         forgotPasswordToken: {
//           type: String,
//         },
//         forgotPasswordExpireAt: {
//           type: Date,
//         },
//         status: {
//           type: String,
//           enum: ['active', 'inactive', 'pending'],
//           default: 'inactive',
//         },
//         address: {
//           type: String,
//         },
//         verifyOtp: {
//           type: String || Number,
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
//         if (!this.isModified('password')) return next(); // kiểm tra mật khẩu xem nó nhập vào chưa
//         try {
//           const salt = await bcrypt.genSaltSync(10); // băm 10 phát
//           this.password = await bcrypt.hash(this.password, salt);
//           return next();
//         } catch (err) {
//           return next(err);
//         }
//       });

//       // this.schema.pre('update', async function update (next: any) {
//       //   const { _update } = this;
//       //   const CUSTOMER_CLASS_ENUM = { BRONZE: 'Bronze', SILVER: 'Silver', GOLD: 'Gold', DIAMOND: 'Diamond' };
//       //   if (+_update.accumulatedPoint >= 2000000 && +_update.accumulatedPoint < 5000000) {
//       //     this._update.customerClass = CUSTOMER_CLASS_ENUM.SILVER;
//       //   } else if (+_update.accumulatedPoint >= 5000000 && +_update.accumulatedPoint < 10000000) {
//       //     this._update.customerClass = CUSTOMER_CLASS_ENUM.GOLD;
//       //   } else if (+_update.accumulatedPoint >= 10000000) {
//       //     this._update.customerClass = CUSTOMER_CLASS_ENUM.DIAMOND;
//       //   } else {
//       //     this._update.customerClass = CUSTOMER_CLASS_ENUM.BRONZE;
//       //   }
//       // });

//       if (!mongoose.models[User.COLLECTION_NAME]) { // Kiểm tra có tồn tại bảng này trong database không
//         mongoose.model(User.COLLECTION_NAME, this.schema, User.COLLECTION_NAME);
//       }
//       this.model = mongoose.model(User.COLLECTION_NAME);
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

// export default new User();

import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../database';

class User extends Model {
  public static async hashPassword (password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}

User.init({
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
    type: DataTypes.ENUM('male', 'female', 'other'),
    defaultValue: 'male',
  },
  accept_policy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: DataTypes.ENUM('USER'),
    defaultValue: 'USER',
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  accumulated_point: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  customer_class: {
    type: DataTypes.ENUM('Bronze', 'Silver', 'Gold', 'Diamond'),
    defaultValue: 'Bronze',
  },
  is_verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'inactive',
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  verify_otp: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  discount_used: {
    type: DataTypes.TEXT,
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
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

User.beforeUpdate((user: any) => {
  const CUSTOMER_CLASS_ENUM = {
    BRONZE: 'Bronze',
    SILVER: 'Silver',
    GOLD: 'Gold',
    DIAMOND: 'Diamond',
  };

  if (user.accumulated_point >= 2000000 && user.accumulated_point < 5000000) {
    user.customer_class = CUSTOMER_CLASS_ENUM.SILVER;
  } else if (user.accumulated_point >= 5000000 && user.accumulated_point < 10000000) {
    user.customer_class = CUSTOMER_CLASS_ENUM.GOLD;
  } else if (user.accumulated_point >= 10000000) {
    user.customer_class = CUSTOMER_CLASS_ENUM.DIAMOND;
  } else {
    user.customer_class = CUSTOMER_CLASS_ENUM.BRONZE;
  }
});

export default User;
