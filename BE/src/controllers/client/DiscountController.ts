// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import Discount from '@models/Discount';
// import { NoData } from '@libs/errors';
// import moment from 'moment';

// class DiscountController {
//   public async index (req: Request, res: Response) {
//     try {
//       const queryString: any = {
//         code: req.query.code,
//       };
//       const discount : any = await Discount.model.findOne(queryString);
//       if (!discount) {
//         return sendError(res, 404, NoData);
//       }

//       if (moment() > discount.expirationDate) {
//         return sendSuccess(res, { discount: { message: Discount.ERROR_NOTE.EXPIRATION } });
//       }
//       if (discount.count === 0) {
//         return sendSuccess(res, { discount: { message: Discount.ERROR_NOTE.MAX_COUNT } });
//       }

//       const result : any = {
//         title: discount.title,
//         code: discount.code,
//         thumbnail: discount.thumbnail,
//         content: discount.content,
//         condition: discount.condition,
//         discount: discount.discount,
//         valueCondition: discount.valueCondition,
//       };
//       await discount.update({ count: discount.count - 1 });

//       sendSuccess(res, { discount: result });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new DiscountController();

import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import Discount from '@models/Discount';
import User from '@models/User';
import { NoData } from '@libs/errors';
import moment from 'moment';
import _Constants from '@configs/constants';

class DiscountController {
  public async index (req: Request, res: Response) {
    try {
      const { code } = req.query;
      if (!code) {
        return sendError(res, 400, 'Discount code is required');
      }
      const discount: any = await Discount.findOne({
        where: { code },
      });

      const currentUser = req.currentUser;
      const user: any = await User.findByPk(currentUser.id);

      if (!discount) {
        return sendError(res, 404, NoData);
      }

      if (discount.status === 'inactive' || discount.status === 'over') {
        return sendSuccess(res, {
          discount: { message: _Constants.ERROR_NOTE.EXPIRATION },
        });
      }

      if (
        (discount.start_date && moment().isBefore(moment(discount.start_date, 'YYYY-MM-DD HH:mm:ss'))) ||
        (discount.expiration_date && moment().isAfter(moment(discount.expiration_date, 'YYYY-MM-DD HH:mm:ss')))
      ) {
        return sendSuccess(res, {
          discount: { message: _Constants.ERROR_NOTE.EXPIRATION },
        });
      }

      if (discount.count === 0) {
        return sendSuccess(res, {
          discount: { message: _Constants.ERROR_NOTE.MAX_COUNT },
        });
      }

      // Xử lý việc sử dụng discount
      const usedCodes = user.discount_used?.split(',').filter(Boolean) || [];
      const timesUsed = usedCodes.filter((item: any) => item === discount.code).length;

      if (timesUsed >= discount.limit_on_user) {
        return sendSuccess(res, {
          discount: { message: _Constants.ERROR_NOTE.LIMIT },
        });
      }

      sendSuccess(res, { discount });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new DiscountController();
