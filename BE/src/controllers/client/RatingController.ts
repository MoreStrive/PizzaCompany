// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import ModelRating from '@models/Rating';
// import ModelProduct from '@models/Product';
// import { NoData } from '@libs/errors';
// import _ from 'lodash';

// class RatingController {
//   public async create (req: any, res: Response) {
//     try {
//       const user = req.currentUser;
//       const productId = req.params.productId;
//       if (productId.length !== 24) {
//         return sendError(res, 404, NoData);
//       }
//       const product = await ModelProduct.model.findOne({ _id: productId, status: ModelProduct.STATUS_ENUM.ACTIVE });
//       if (!product) {
//         return sendError(res, 404, NoData);
//       }
//       const params = req.body;
//       const rating = await ModelRating.model.create({
//         ...params,
//         user: user,
//         productId,
//       });
//       sendSuccess(res, { rating });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async index (req: Request, res: Response) {
//     try {
//       const productId = req.params.productId;
//       const queryString: any = {
//         productId: productId,
//         status: 'active',
//       };
//       const ratings = await ModelRating.model.find(queryString).sort({ createdAt: -1 });
//       const total = await ModelRating.model.find(queryString).count();
//       const getAllRatings = await ModelRating.model.find(queryString);
//       const ratingAVG = _.sumBy(getAllRatings, 'rating') / total;
//       sendSuccess(res, { ratings, ratingAVG, pagination: { total } });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new RatingController();

import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import Rating from '@models/Rating';
import Product from '@models/Product';
import { NoData } from '@libs/errors';
import User from '@models/User';
import _ from 'lodash';

class RatingController {
  public async create (req: any, res: Response) {
    try {
      const user = req.currentUser;
      const productId = req.params.productId;

      if (isNaN(Number(productId))) {
        return sendError(res, 404, NoData);
      }

      const product : any = await Product.findOne({
        where: { id: productId, status: 'active' },
      });
      if (!product) {
        return sendError(res, 404, NoData);
      }

      console.log(product);

      const params = req.body;
      const rating = await Rating.create({
        ...params,
        user_id: user.id,
        product_id: product.id,
      });

      sendSuccess(res, { rating });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const productId = req.params.productId;
      if (isNaN(Number(productId))) {
        return sendError(res, 404, NoData);
      }
      const ratings = await Rating.findAll({
        where: { product_id: productId, status: 'active' },
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            as: 'user', // Bao gồm thông tin người dùng đã đánh giá
            attributes: ['id', 'full_name', 'avatar'], // Chỉ lấy các trường cần thiết
          },
        ],
      });
      const total = ratings.length;
      const ratingAVG = total > 0 ? _.sumBy(ratings, 'rating') / total : 0;
      sendSuccess(res, { ratings, ratingAVG, pagination: { total } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new RatingController();
