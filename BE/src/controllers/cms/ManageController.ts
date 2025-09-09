// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import ModelStaffSystem from '@models/StaffSystem';
// import { NoData, ServiceUnavailable } from '@libs/errors';

// class ManageController {
//   public async index (req: Request, res: Response) {
//     try {
//       const page = parseInt(req.query.page as string || '1');
//       const limit = parseInt(req.query.limit as string || '12');
//       const offset = (page - 1) * limit;
//       let queryString = {};
//       const { freeWord, salary, role, gender } = req.query;
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
//       if (salary) {
//         const currentSalary = salary as String;
//         queryString = {
//           ...queryString,
//           salary: { $gt: currentSalary.split('-')[0], $lt: currentSalary.split('-')[1] },
//         };
//       }
//       if (role) {
//         queryString = {
//           ...queryString,
//           role: role,
//         };
//       }

//       const staffs = await ModelStaffSystem.model.find(queryString).skip(offset).limit(limit).sort({ createdAt: -1 }).lean();
//       const total = await ModelStaffSystem.model.find(queryString).count();

//       sendSuccess(res, { staffs, pagination: { total, page, limit } });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async show (req: any, res: Response) {
//     try {
//       const queryString: any = {
//         _id: req.params.staffId,
//       };
//       const staff = await ModelStaffSystem.model.findOne(queryString);
//       if (!staff) {
//         return sendError(res, 404, NoData);
//       }
//       sendSuccess(res, { staff });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async registerStaff (req: Request, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       let params : any = {};
//       if (currentActor.role === ModelStaffSystem.ROLE_ENUM.ADMIN) {
//         params = req.parameters.permit(ModelStaffSystem.ADMIN_CREATE_PARAMETERS).value();
//       } else if (currentActor.role === ModelStaffSystem.ROLE_ENUM.MANAGE) {
//         params = req.parameters.permit(ModelStaffSystem.CREATABLE_PARAMETERS).value();
//       }
//       const staff = await ModelStaffSystem.model.create({ ...params, isVerify: false });
//       sendSuccess(res, { staff });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async update (req: Request, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       const queryString: any = {
//         _id: req.params.staffId,
//       };
//       const staff = await ModelStaffSystem.model.findOne(queryString);
//       if (!staff) {
//         return sendError(res, 404, NoData);
//       }

//       let params : any = {};

//       if (currentActor.role === ModelStaffSystem.ROLE_ENUM.ADMIN) {
//         params = req.parameters.permit(ModelStaffSystem.ADMIN_UPDATABLE_PARAMETERS).value();
//       } else if (currentActor.role === ModelStaffSystem.ROLE_ENUM.MANAGE || currentActor.role === ModelStaffSystem.ROLE_ENUM.STAFF) {
//         params = req.parameters.permit(ModelStaffSystem.UPDATABLE_PARAMETERS).value();
//       }
//       await staff.update(params);
//       const record = await ModelStaffSystem.model.findById(req.params.staffId);
//       sendSuccess(res, { staff: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async updateRole (req: Request, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       const queryString: any = {
//         _id: req.params.staffId,
//       };
//       const staff = await ModelStaffSystem.model.findOne(queryString);
//       if (!staff) {
//         return sendError(res, 404, NoData);
//       }
//       if (currentActor.role !== ModelStaffSystem.ROLE_ENUM.ADMIN) {
//         return sendError(res, 503, ServiceUnavailable);
//       }
//       const { role } = req.body;
//       await staff.update({ role: role });
//       const record = await ModelStaffSystem.model.findById(req.params.staffId);
//       sendSuccess(res, { product: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async delete (req: Request, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       const queryString: any = {
//         _id: req.params.staffId,
//       };
//       const staff = await ModelStaffSystem.model.findOne(queryString);
//       if (!staff) {
//         return sendError(res, 404, NoData);
//       }
//       if (currentActor.role !== ModelStaffSystem.ROLE_ENUM.ADMIN) {
//         return sendError(res, 503, ServiceUnavailable);
//       }
//       await staff.delete();
//       sendSuccess(res, { status: true });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new ManageController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import StaffSystem from '@models/StaffSystem';
import { NoData, ServiceUnavailable } from '@libs/errors';
import { Op } from 'sequelize';
import _Constants from '@configs/constants';
import * as _Utils from '@configs/utils';

class ManageController {
  /**
   * Lấy danh sách nhân viên với phân trang và điều kiện lọc
   */
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt((req.query.page as string) || '1');
      const limit = parseInt((req.query.limit as string) || '12');
      const offset = (page - 1) * limit;

      const { freeWord, salary, role, gender } = req.query;

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

      // Lọc theo mức lương
      if (salary) {
        const [minSalary, maxSalary] = (salary as string).split('-').map(Number);
        where.salary = { [Op.between]: [minSalary, maxSalary] };
      }

      // Lọc theo role
      if (role) where.role = role;

      // Truy vấn danh sách nhân viên
      const { rows: staffs, count: total } = await StaffSystem.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']],
      });

      sendSuccess(res, { staffs, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Lấy chi tiết nhân viên theo ID
   */
  public async show (req: Request, res: Response) {
    try {
      const staffId = req.params.staffId;

      const staff = await StaffSystem.findByPk(staffId);

      if (!staff) {
        return sendError(res, 404, NoData);
      }

      sendSuccess(res, { staff });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Đăng ký nhân viên mới
   */
  public async registerStaff (req: Request, res: Response) {
    try {
      const currentActor = req.currentActor;

      let params: any = {};
      const allowedRoles = [_Constants.ROLE_ENUM.ADMIN, _Constants.ROLE_ENUM.MANAGER];

      if (!allowedRoles.includes(currentActor.role)) {
        return sendError(res, 503, ServiceUnavailable);
      }

      if (currentActor.role === _Constants.ROLE_ENUM.ADMIN) {
        params = _Utils.permit(req.body, _Constants.ADMIN_CREATABLE_STAFF_PARAMETERS).value();
      } else if (currentActor.role === _Constants.ROLE_ENUM.MANAGER) {
        params = _Utils.permit(req.body, _Constants.MANAGE_CREATABLE_STAFF_PARAMETERS).value();
      }

      console.log(params);

      // Kiểm tra dữ liệu đầu vào trước khi tạo
      if (params.date_of_birth && isNaN(Date.parse(params.date_of_birth))) {
        return sendError(res, 400, 'Invalid date_of_birth format');
      }

      if (params.join_date && isNaN(Date.parse(params.join_date))) {
        return sendError(res, 400, 'Invalid join_date format');
      }

      if (params.salary && isNaN(Number(params.salary))) {
        return sendError(res, 400, 'Salary must be a numeric value');
      }

      if ([_Constants.ROLE_ENUM.ADMIN, _Constants.ROLE_ENUM.MANAGER].includes(params.role)) {
        return sendError(res, 400, 'Invalid role value');
      }

      // Chuyển đổi dữ liệu về đúng định dạng
      params.date_of_birth = params.date_of_birth ? new Date(params.date_of_birth) : null;
      params.join_date = params.join_date ? new Date(params.join_date) : null;
      params.salary = params.salary ? parseFloat(params.salary) : null;
      const password = await StaffSystem.hashPassword(params.password);

      const staff = await StaffSystem.create({
        ...params,
        password,
        is_verify: false,
      });

      sendSuccess(res, { staff });
    } catch (error: any) {
      console.error('Validation error:', error);
      sendError(res, 500, error.message || 'Internal Server Error', error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const currentActor = req.currentActor;
      const staffId = req.params.staffId;

      const staff = await StaffSystem.findByPk(staffId);

      if (!staff) {
        return sendError(res, 404, NoData);
      }

      let params: any = {};

      if (currentActor.role === _Constants.ROLE_ENUM.ADMIN) {
        params = _Utils.permit(req.body, _Constants.ADMIN_UPDATEABLE_STAFF_PARAMETERS).value();
      } else if (
        currentActor.role === _Constants.ROLE_ENUM.MANAGER ||
        currentActor.role === _Constants.ROLE_ENUM.STAFF
      ) {
        params = _Utils.permit(req.body, _Constants.MANAGE_UPDATEABLE_STAFF_PARAMETERS).value();
      }

      await staff.update(params);

      sendSuccess(res, { staff });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Cập nhật role của nhân viên
   */
  public async updateRole (req: Request, res: Response) {
    try {
      const currentActor = req.currentActor;
      const staffId = req.params.staffId;

      const staff = await StaffSystem.findByPk(staffId);

      if (!staff) {
        return sendError(res, 404, NoData);
      }

      if (currentActor.role !== _Constants.ROLE_ENUM.ADMIN) {
        return sendError(res, 503, ServiceUnavailable);
      }

      const { role } = req.body;

      await staff.update({ role });

      sendSuccess(res, { staff });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Xóa nhân viên (chỉ ADMIN mới được phép)
   */
  public async delete (req: Request, res: Response) {
    try {
      const currentActor = req.currentActor;
      const staffId = req.params.staffId;

      const staff = await StaffSystem.findByPk(staffId);

      if (!staff) {
        return sendError(res, 404, NoData);
      }

      if (currentActor.role !== _Constants.ROLE_ENUM.ADMIN) {
        return sendError(res, 503, ServiceUnavailable);
      }

      await staff.destroy();

      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ManageController();
