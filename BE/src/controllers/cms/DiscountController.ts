// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import DiscountModel from '@models/Discount';
// import ModelStaffSystem from '@models/StaffSystem';
// import { NoData, ServiceUnavailable } from '@libs/errors';

// class DiscountController {
//   public async index (req: Request, res: Response) {
//     try {
//       const page = parseInt(req.query.page as string || '1');
//       const limit = parseInt(req.query.limit as string || '12');
//       const offset = (page - 1) * limit;

//       const discounts = await DiscountModel.model.find().skip(offset).limit(limit).sort({ createdAt: -1 }).lean();
//       const total = await DiscountModel.model.find().count();

//       sendSuccess(res, { discounts, pagination: { total, page, limit } });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async create (req: Request, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       if (currentActor.role !== ModelStaffSystem.ROLE_ENUM.ADMIN) {
//         return sendError(res, 503, ServiceUnavailable);
//       }
//       const params = req.body;
//       const discount = await DiscountModel.model.create(params);
//       sendSuccess(res, { discount });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async update (req: any, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       if (currentActor.role !== ModelStaffSystem.ROLE_ENUM.ADMIN) {
//         return sendError(res, 503, ServiceUnavailable);
//       }
//       const queryString: any = {
//         _id: req.params.discountId,
//       };
//       const discount = await DiscountModel.model.findOne(queryString);
//       if (!discount) {
//         return sendError(res, 404, NoData);
//       }
//       const params = req.body;
//       await discount.update(params);
//       const record = await DiscountModel.model.findById(req.params.productId);
//       sendSuccess(res, { discount: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async delete (req: any, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       if (currentActor.role !== ModelStaffSystem.ROLE_ENUM.ADMIN) {
//         return sendError(res, 503, ServiceUnavailable);
//       }
//       const queryString: any = {
//         _id: req.params.discountId,
//       };
//       const discount = await DiscountModel.model.findOne(queryString);
//       if (!discount) {
//         return sendError(res, 404, NoData);
//       }
//       const params = req.body;
//       await discount.update(params);
//       const record = await DiscountModel.model.findById(req.params.productId);
//       sendSuccess(res, { product: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new DiscountController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import Discount from '@models/Discount';
import { NoData, ServiceUnavailable } from '@libs/errors';
import _Constants from '@configs/constants';

class DiscountController {
  /**
   * Lấy danh sách mã giảm giá với phân trang
   */
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt((req.query.page as string) || '1');
      const limit = parseInt((req.query.limit as string) || '12');
      const offset = (page - 1) * limit;

      // Truy vấn mã giảm giá với phân trang
      const { rows: discounts, count: total } = await Discount.findAndCountAll({
        limit,
        offset,
        order: [['created_at', 'DESC']],
      });

      sendSuccess(res, { discounts, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Tạo mới mã giảm giá (chỉ ADMIN được phép)
   */
  public async create (req: Request, res: Response) {
    try {
      const currentActor = req.currentActor;

      if (currentActor.role !== _Constants.ROLE_ENUM.ADMIN) {
        return sendError(res, 503, ServiceUnavailable);
      }

      const params = req.body;

      const discount = await Discount.create(params);

      sendSuccess(res, { discount });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Cập nhật thông tin mã giảm giá (chỉ ADMIN được phép)
   */
  public async update (req: Request, res: Response) {
    try {
      const currentActor = req.currentActor;

      if (currentActor.role !== _Constants.ROLE_ENUM.ADMIN) {
        return sendError(res, 503, ServiceUnavailable);
      }

      const discountId = req.params.discountId;

      const discount = await Discount.findByPk(discountId);

      if (!discount) {
        return sendError(res, 404, NoData);
      }

      const params = req.body;

      // Cập nhật mã giảm giá
      await discount.update(params);

      sendSuccess(res, { discount });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Xóa mã giảm giá (chỉ ADMIN được phép)
   */
  public async delete (req: Request, res: Response) {
    try {
      const currentActor = req.currentActor;

      if (currentActor.role !== _Constants.ROLE_ENUM.ADMIN) {
        return sendError(res, 503, ServiceUnavailable);
      }

      const discountId = req.params.discountId;

      const discount = await Discount.findByPk(discountId);

      if (!discount) {
        return sendError(res, 404, NoData);
      }

      // Xóa mã giảm giá
      await discount.destroy();

      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new DiscountController();
