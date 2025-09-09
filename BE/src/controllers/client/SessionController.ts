// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import UserModel from '@models/User';
// import bcrypt from 'bcryptjs';
// import { BadAuthentication, InvalidOtp, invalidParameter, InvalidPassword, NoData } from '@libs/errors';
// import jwt from 'jsonwebtoken';
// import settings from '@configs/settings';
// import { Document } from 'mongoose';
// import MailerService from '@services/mailer';
// import dayjs from 'dayjs';

// class SessionController {
//   public async login (req: Request, res: Response) {
//     try {
//       const { username, password } = req.body; // gửi lên từ client
//       const user = await UserModel.model.findOne({
//         $or: [
//           {
//             email: username,
//           }, {
//             username: username,
//           },
//         ],
//         status: UserModel.STATUS_ENUM.ACTIVE,
//       });
//       if (!user || !await bcrypt.compare(password, user.get('password'))) {
//         return sendError(res, 404, BadAuthentication);
//       }
//       const accessToken = jwt.sign({ id: user.get('_id') }, settings.jwt.secret, { expiresIn: settings.jwt.ttl });
//       sendSuccess(res, { accessToken, tokenExpireAt: settings.jwt.ttl });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async register (req: Request, res: Response) {
//     try {
//       const params = req.parameters.permit(UserModel.CREATABLE_PARAMETERS).value();
//       const user = await UserModel.model.create({
//         ...params,
//         status: UserModel.STATUS_ENUM.ACTIVE,
//       });
//       const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
//       await user.update({ verifyOtp: otp });
//       MailerService.verifyAccountOTP(user.get('email'), otp);
//       user.set('verifyOtp', null);
//       sendSuccess(res, { user });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async getCurrentUser (req: any, res: Response) {
//     try {
//       const user = req.currentUser;
//       sendSuccess(res, { user });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async verifyEmail (req: Request, res: Response) {
//     try {
//       const { email, otp } = req.body;
//       const user = await UserModel.model.findOne({ email });
//       if (!user) {
//         return sendError(res, 404, NoData);
//       }
//       if (otp !== user.get('verifyOtp')) {
//         return sendError(res, 400, InvalidOtp);
//       }
//       await user.update({ status: UserModel.STATUS_ENUM.ACTIVE, verifyOtp: null });
//       sendSuccess(res, { });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async sendBackOtp (req: Request, res: Response) {
//     try {
//       const { email } = req.body;
//       const user = await UserModel.model.findOne({ email, status: UserModel.STATUS_ENUM.PENDING });
//       if (!user) {
//         return sendError(res, 404, NoData);
//       }
//       const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
//       await user.update({ verifyOtp: otp });
//       MailerService.verifyAccountOTP(user.get('email'), otp);
//       sendSuccess(res, {});
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async update (req: any, res: Response) {
//     try {
//       const user: Document = req.currentUser;
//       const params = req.parameters.permit(UserModel.UPDATABLE_PARAMETERS).value();
//       await user.update(params);
//       const record = await UserModel.model.findOne({ _id: user.get('_id') });
//       sendSuccess(res, { user: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async changePassword (req: any, res: Response) {
//     try {
//       const user: Document = req.currentUser;
//       const { oldPassword, newPassword, confirmPassword } = req.body;
//       const checkOldPassword = await bcrypt.compare(oldPassword, user.get('password'));
//       if (!checkOldPassword) { return sendError(res, 400, InvalidPassword); }
//       if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
//       const salt = bcrypt.genSaltSync();
//       const newPasswordEncode = bcrypt.hashSync(newPassword, salt);
//       await UserModel.model.updateOne({ _id: user.get('_id') }, { password: newPasswordEncode });
//       sendSuccess(res, { user });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async forgotPassword (req:Request, res: Response) {
//     try {
//       const email = req.body.email;
//       const user = await UserModel.model.findOne({ email });
//       if (!user) return sendError(res, 404, NoData);
//       const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
//       const expireAt = (dayjs().add(settings.forgotPasswordTokenExpiresIn, 'day'));
//       await UserModel.model.updateOne({ _id: user.get('_id') }, {
//         forgotPasswordToken: otp,
//         forgotPasswordExpireAt: expireAt,
//       });
//       MailerService.sendForgotPasswordOTP(email, otp);
//       sendSuccess(res, {});
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async verifyOtp (req: Request, res: Response) {
//     try {
//       const { email, otp } = req.body;
//       const user = await UserModel.model.findOne({ email });
//       if (!user || !user.get('verifyOtp') === otp) return sendError(res, 404, NoData);
//       const data = await UserModel.model.updateOne({ _id: user.get('_id') }, {
//         isVerify: true,
//       });
//       sendSuccess(res, { data });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async resetPassword (req:Request, res:Response) {
//     try {
//       const { newPassword, confirmPassword, email } = req.body;
//       const user = await UserModel.model.findOne({ email });

//       if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
//       const salt = bcrypt.genSaltSync();
//       const newPasswordEncode = bcrypt.hashSync(newPassword, salt);
//       await UserModel.model.updateOne({ _id: user.get('_id') }, { password: newPasswordEncode });
//       sendSuccess(res, { });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new SessionController();

import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import User from '@models/User';
import bcrypt from 'bcryptjs';
import { BadAuthentication, InvalidOtp, invalidParameter, InvalidPassword, NoData } from '@libs/errors';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import MailerService from '@services/mailer';
import { Op } from 'sequelize';

class SessionController {
  public async login (req: Request, res: Response) {
    try {
      const { username, password } = req.body; // Data sent from client
      const user : any = await User.findOne({
        where: {
          [Op.or]: [
            { email: username },
            { username: username },
          ],
          status: 'active',
        },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return sendError(res, 404, BadAuthentication);
      }

      const accessToken = jwt.sign({ id: user.id }, settings.jwt.secret, { expiresIn: settings.jwt.ttl });
      sendSuccess(res, { accessToken, tokenExpireAt: settings.jwt.ttl });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async register (req: Request, res: Response) {
    try {
      const params = req.body;
      const user : any = await User.create({
        ...params,
        status: 'active',
        password: await User.hashPassword(params.password),
      });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await user.update({ verify_otp: otp });

      MailerService.verifyAccountOTP(user.email, otp);
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async getCurrentUser (req: any, res: Response) {
    try {
      const user = req.currentUser;
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async verifyEmail (req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const user : any = await User.findOne({ where: { email } });

      if (!user) {
        return sendError(res, 404, NoData);
      }

      if (otp !== user.verify_otp) {
        return sendError(res, 400, InvalidOtp);
      }

      await user.update({ status: 'active', verify_otp: null });
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async sendBackOtp (req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user : any = await User.findOne({ where: { email, status: 'pending' } });

      if (!user) {
        return sendError(res, 404, NoData);
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await user.update({ verify_otp: otp });

      MailerService.verifyAccountOTP(user.email, otp);
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: any, res: Response) {
    try {
      const user = req.currentUser;
      const params = req.body;

      await user.update(params);

      const updatedUser = await User.findByPk(user.id);
      sendSuccess(res, { user: updatedUser });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async changePassword (req: any, res: Response) {
    try {
      const user = req.currentUser;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) return sendError(res, 400, InvalidPassword);

      if (newPassword !== confirmPassword) return sendError(res, 400, invalidParameter);

      const newPasswordHash = await User.hashPassword(newPassword);
      await user.update({ password: newPasswordHash });

      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async forgotPassword (req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) return sendError(res, 404, NoData);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await user.update({
        verify_otp: otp,
      });

      MailerService.sendForgotPasswordOTP(email, otp);
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async verifyOtp (req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ where: { email, verify_otp: otp } });
      if (!user) return sendError(res, 404, NoData);
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async resetPassword (req:Request, res:Response) {
    try {
      const { newPassword, confirmPassword, email } = req.body;
      const user : any = await User.findOne({
        where: {
          [Op.or]: [
            { email: email },
          ],
        },
      });

      if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
      const salt = bcrypt.genSaltSync();
      const newPasswordEncode = bcrypt.hashSync(newPassword, salt);
      await user.update({ password: newPasswordEncode });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
// }
}

export default new SessionController();
