// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import ModelUser from '@models/User';
// import ModelStaffSystem from '@models/StaffSystem';
// import { NoData, ServiceUnavailable } from '@libs/errors';

// class UserController {
//   public async index (req: Request, res: Response) {
//     try {
//       const page = parseInt(req.query.page as string || '1');
//       const limit = parseInt(req.query.limit as string || '12');
//       const offset = (page - 1) * limit;
//       let queryString = {};
//       const { freeWord, gender } = req.query;
//       if (freeWord) {
//         queryString = {
//           ...queryString,
//           $or: [
//             { fullName: { $regex: freeWord } },
//             { email: { $regex: freeWord } },
//             { phoneNumber: { $regex: freeWord } },
//           ],
//         };
//       }
//       if (gender) {
//         queryString = {
//           ...queryString,
//           gender: gender,
//         };
//       }
//       const users = await ModelUser.model.find(queryString).skip(offset).limit(limit).sort({ createdAt: -1 }).lean();
//       const total = await ModelUser.model.find(queryString).count();

//       sendSuccess(res, { users, pagination: { total, page, limit } });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async show (req: any, res: Response) {
//     try {
//       const queryString: any = {
//         _id: req.params.userId,
//       };
//       const user = await ModelUser.model.findOne(queryString);
//       if (!user) {
//         return sendError(res, 404, NoData);
//       }
//       sendSuccess(res, { user });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async registerUser (req: Request, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       let params : any = {};
//       if (currentActor.role === ModelStaffSystem.ROLE_ENUM.ADMIN) {
//         params = req.parameters.permit(ModelStaffSystem.ADMIN_CREATE_PARAMETERS).value();
//       } else if (currentActor.role === ModelStaffSystem.ROLE_ENUM.MANAGE) {
//         params = req.parameters.permit(ModelUser.CREATABLE_PARAMETERS).value();
//       }
//       const user = await ModelUser.model.create({ ...params, isVerify: false });
//       sendSuccess(res, { user });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async update (req: Request, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       const queryString: any = {
//         _id: req.params.userId,
//       };
//       const user = await ModelUser.model.findOne(queryString);
//       if (!user) {
//         return sendError(res, 404, NoData);
//       }

//       let params : any = {};

//       if (currentActor.role === ModelStaffSystem.ROLE_ENUM.ADMIN) {
//         params = req.parameters.permit(ModelUser.ADMIN_UPDATABLE_PARAMETERS).value();
//       } else if (currentActor.role === ModelStaffSystem.ROLE_ENUM.MANAGE) {
//         params = req.parameters.permit(ModelUser.UPDATABLE_PARAMETERS).value();
//       }
//       await user.update(params);
//       const record = await ModelUser.model.findById(req.params.staffId);
//       sendSuccess(res, { user: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async delete (req: Request, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       const queryString: any = {
//         _id: req.params.userId,
//       };
//       const user = await ModelUser.model.findOne(queryString);
//       if (!user) {
//         return sendError(res, 404, NoData);
//       }
//       if (currentActor.role !== ModelStaffSystem.ROLE_ENUM.ADMIN) {
//         return sendError(res, 503, ServiceUnavailable);
//       }
//       await user.delete();
//       sendSuccess(res, { status: true });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new UserController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import User from '@models/User';
import { NoData, ServiceUnavailable } from '@libs/errors';
import { Op } from 'sequelize';
import _Constants from '@configs/constants';

class UserController {
  /**
   * Lấy danh sách người dùng với phân trang và điều kiện lọc
   */
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const offset = (page - 1) * limit;

      const { freeWord, gender } = req.query;

      const where: any = {};

      // Lọc theo từ khóa tự do
      if (freeWord) {
        where[Op.or] = [
          { full_name: { [Op.like]: `%${freeWord}%` } },
          { email: { [Op.like]: `%${freeWord}%` } },
          { phone_number: { [Op.like]: `%${freeWord}%` } },
        ];
      }

      // Lọc theo giới tính
      if (gender) where.gender = gender;

      // Truy vấn danh sách người dùng
      const { rows: users, count: total } = await User.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']],
      });

      sendSuccess(res, { users, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Lấy chi tiết người dùng theo ID
   */
  public async show (req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      const user = await User.findByPk(userId);

      if (!user) {
        return sendError(res, 404, NoData);
      }

      sendSuccess(res, { user });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Đăng ký người dùng mới
   */
  public async registerUser (req: Request, res: Response) {
    try {
      const currentActor = req.currentActor;
      let params: any = {};

      if (currentActor.role === _Constants.ROLE_ENUM.ADMIN) {
        params = req.body;
      } else if (currentActor.role === _Constants.ROLE_ENUM.MANAGER) {
        params = req.body;
      }

      const user = await User.create({ ...params, is_verify: false });

      sendSuccess(res, { user });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Cập nhật thông tin người dùng
   */
  public async update (req: Request, res: Response) {
    try {
      const currentActor = req.currentActor;
      const userId = req.params.userId;

      const user = await User.findByPk(userId);

      if (!user) {
        return sendError(res, 404, NoData);
      }

      let params: any = {};

      if (currentActor.role === _Constants.ROLE_ENUM.ADMIN) {
        params = req.body;
      } else if (currentActor.role === _Constants.ROLE_ENUM.MANAGER) {
        params = req.body;
      }

      // Cập nhật thông tin người dùng
      await user.update(params);

      sendSuccess(res, { user });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Xóa người dùng (chỉ ADMIN mới được phép)
   */
  public async delete (req: Request, res: Response) {
    try {
      const currentActor = req.currentActor;
      const userId = req.params.userId;

      const user = await User.findByPk(userId);

      if (!user) {
        return sendError(res, 404, NoData);
      }

      if (currentActor.role !== _Constants.ROLE_ENUM.ADMIN) {
        return sendError(res, 503, ServiceUnavailable);
      }

      // Xóa người dùng
      await user.destroy();

      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new UserController();
