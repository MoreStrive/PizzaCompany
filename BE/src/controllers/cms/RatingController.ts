// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import ModelRating from '@models/Rating';
// import { ProductRated } from '@libs/errors';
// import _ from 'lodash';

// class RatingController {
//   public async index (req: Request, res: Response) {
//     try {
//       const productId = req.params.productId;
//       const queryString: any = {
//         productId,
//       };
//       const ratings = await ModelRating.model.find(queryString).sort({ createdAt: -1 });
//       const total = await ModelRating.model.find(queryString).count();
//       const getAllRatings = await ModelRating.model.find(queryString);
//       const ratingAVG = _.sumBy(getAllRatings, 'rating') / total;
//       sendSuccess(res, { ratings, ratingAVG });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async update (req: any, res: Response) {
//     try {
//       const ratingId = req.params.ratingId;

//       const currentRating = await ModelRating.model.findById(ratingId);
//       if (!currentRating) {
//         return sendError(res, 400, ProductRated);
//       }
//       const params = req.body;
//       await currentRating.update(params);
//       const rating = await ModelRating.model.findById(ratingId);
//       sendSuccess(res, { rating });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async delete (req: any, res: Response) {
//     try {
//       const ratingId = req.params.ratingId;
//       const currentRating = await ModelRating.model.findById(ratingId);
//       if (!currentRating) {
//         return sendError(res, 400, ProductRated);
//       }
//       await currentRating.delete();
//       sendSuccess(res, { status: true });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new RatingController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import Rating from '@models/Rating';
import User from '@models/User';
import { ProductRated } from '@libs/errors';
import _ from 'lodash';

class RatingController {
  public async index (req: Request, res: Response) {
    try {
      const productId = req.params.productId;
      const ratings = await Rating.findAll({
        where: { product_id: productId },
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

      sendSuccess(res, { ratings, ratingAVG });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const ratingId = req.params.ratingId;
      const currentRating = await Rating.findByPk(ratingId);

      if (!currentRating) {
        return sendError(res, 400, ProductRated);
      }

      const params = req.body;
      await currentRating.update(params);

      sendSuccess(res, { rating: currentRating });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const ratingId = req.params.ratingId;

      const currentRating = await Rating.findByPk(ratingId);

      if (!currentRating) {
        return sendError(res, 400, ProductRated);
      }
      await currentRating.destroy();

      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new RatingController();
