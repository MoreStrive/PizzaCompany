// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import StaffSystem from '@models/StaffSystem';
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
//       const { username, password } = req.body;
//       const user = await StaffSystem.model.findOne({ username: username, status: StaffSystem.STATUS_ENUM.ACTIVE });
//       if (!user || !await bcrypt.compare(password, user.get('password'))) {
//         return sendError(res, 404, BadAuthentication);
//       }
//       const accessToken = jwt.sign({ id: user.get('_id') }, settings.jwt.secret, { expiresIn: settings.jwt.ttl });
//       sendSuccess(res, { accessToken, tokenExpireAt: settings.jwt.ttl });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async getCurrentActor (req: any, res: Response) {
//     try {
//       const actor = req.currentActor;
//       sendSuccess(res, { currentActor: actor });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async register (req: any, res: Response) {
//     try {
//       const params = req.parameters.permit(StaffSystem.CREATABLE_PARAMETERS).value();
//       const user = await StaffSystem.model.create({
//         ...params,
//         status: StaffSystem.STATUS_ENUM.ACTIVE,
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

//   public async verifyEmail (req: Request, res: Response) {
//     try {
//       const { email, otp } = req.body;
//       const user = await StaffSystem.model.findOne({ email });
//       if (!user) {
//         return sendError(res, 404, NoData);
//       }
//       if (otp !== user.get('verifyOtp')) {
//         return sendError(res, 400, InvalidOtp);
//       }
//       await user.update({ status: StaffSystem.STATUS_ENUM.ACTIVE, verifyOtp: null });
//       sendSuccess(res, { });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async sendBackOtp (req: Request, res: Response) {
//     try {
//       const { email } = req.body;
//       const user = await StaffSystem.model.findOne({ email, status: StaffSystem.STATUS_ENUM.PENDING });
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
//       const params = req.parameters.permit(StaffSystem.UPDATABLE_PARAMETERS).value();
//       await user.update(params);
//       const record = await StaffSystem.model.findOne({ _id: user.get('_id') });
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
//       await StaffSystem.model.updateOne({ _id: user.get('_id') }, { password: newPasswordEncode });
//       sendSuccess(res, {});
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async forgotPassword (req:Request, res: Response) {
//     try {
//       const email = req.body.email;
//       const user = await StaffSystem.model.findOne({ email });
//       if (!user) return sendError(res, 404, NoData);
//       const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
//       const expireAt = (dayjs().add(settings.forgotPasswordTokenExpiresIn, 'day'));
//       await StaffSystem.model.updateOne({ _id: user.get('_id') }, {
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
//       const user = await StaffSystem.model.findOne({ email });
//       if (!user || !user.get('verifyOtp') === otp) return sendError(res, 404, NoData);
//       const data = await StaffSystem.model.updateOne({ _id: user.get('_id') }, {
//         isVerify: true,
//       });
//       sendSuccess(res, { data });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async resetPassword (req:Request, res:Response) {
//     try {
//       const { newPassword, confirmPassword, email, token } = req.body;
//       const user = await StaffSystem.model.findOne({ email });
//       if (!user || !(user.get('forgotPasswordToken') === token) || !user.get('forgotPasswordToken')) return sendError(res, 404, NoData);
//       if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
//       const salt = bcrypt.genSaltSync();
//       const newPasswordEncode = bcrypt.hashSync(newPassword, salt);
//       await StaffSystem.model.updateOne({ _id: user.get('_id') }, { password: newPasswordEncode });
//       sendSuccess(res, { });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new SessionController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import StaffSystem from '@models/StaffSystem';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import MailerService from '@services/mailer';
import { BadAuthentication, InvalidOtp, invalidParameter, InvalidPassword, NoData } from '@libs/errors';

class SessionController {
  /**
   * Đăng nhập
   */
  public async login (req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user : any = await StaffSystem.findOne({
        where: { username, status: 'active' },
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

  /**
   * Lấy thông tin người dùng hiện tại
   */
  public async getCurrentActor (req: any, res: Response) {
    try {
      const actor = req.currentActor;
      sendSuccess(res, { currentActor: actor });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Đăng ký người dùng mới
   */
  public async register (req: Request, res: Response) {
    try {
      const params = req.body;

      const user : any = await StaffSystem.create({
        ...params,
        status: 'active',
        password: await StaffSystem.hashPassword(params.password),
      });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.verifyOtp = otp;
      await user.save();

      MailerService.verifyAccountOTP(user.email, otp);
      sendSuccess(res, { user });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async verifyEmail (req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      const user : any = await StaffSystem.findOne({ where: { email } });

      if (!user) return sendError(res, 404, NoData);
      if (user.verifyOtp !== otp) return sendError(res, 400, InvalidOtp);

      user.status = 'active';
      user.verifyOtp = null;
      await user.save();

      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Gửi lại OTP
   */
  public async sendBackOtp (req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user : any = await StaffSystem.findOne({ where: { email, status: 'pending' } });
      if (!user) return sendError(res, 404, NoData);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.verifyOtp = otp;
      await user.save();

      MailerService.verifyAccountOTP(user.email, otp);
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Đổi mật khẩu
   */
  public async changePassword (req: any, res: Response) {
    try {
      const actor : any = req.currentActor;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const isPasswordValid = await bcrypt.compare(oldPassword, actor.password);
      if (!isPasswordValid) return sendError(res, 400, InvalidPassword);
      if (newPassword !== confirmPassword) return sendError(res, 400, invalidParameter);

      actor.password = await StaffSystem.hashPassword(newPassword);
      await actor.save();
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Quên mật khẩu
   */
  public async forgotPassword (req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user : any = await StaffSystem.findOne({ where: { email } });
      if (!user) return sendError(res, 404, NoData);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.verifyOtp = otp;
      await user.save();

      MailerService.sendForgotPasswordOTP(email, otp);
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Xác minh OTP
   */
  public async verifyOtp (req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      const user : any = await StaffSystem.findOne({ where: { email, verifyOtp: otp } });
      if (!user) return sendError(res, 404, NoData);

      user.verifyOtp = null;
      await user.save();

      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async resetPassword (req:Request, res:Response) {
    try {
      const { actorId } = req.params;
      const actor : any = await StaffSystem.findByPk(actorId);
      const salt = bcrypt.genSaltSync();
      const newPasswordEncode = bcrypt.hashSync('Password@123', salt);
      await actor.update({ password: newPasswordEncode });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SessionController();
