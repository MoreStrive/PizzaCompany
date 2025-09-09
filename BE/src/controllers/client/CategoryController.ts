// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import Category from '@models/Category';
// import { NoData } from '@libs/errors';

// class CategoryController {
//   public async index (req: Request, res: Response) {
//     try {
//       const { type } = req.query;
//       let queryString = {};
//       if (type) queryString = Object.assign(queryString, { type });

//       const categories = await Category.model.find(queryString).sort({ order: 1 });
//       sendSuccess(res, { categories });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async show (req: Request, res: Response) {
//     try {
//       const category = await Category.model.findById(req.params.newsCategoryId);
//       if (!category) {
//         return sendError(res, 404, NoData);
//       }
//       sendSuccess(res, { category });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new CategoryController();

import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import Category from '@models/Category';
import Product from '@models/Product';
import { NoData } from '@libs/errors';

class CategoryController {
  public async index (req: Request, res: Response) {
    try {
      const categories = await Category.findAll({
        order: [['order', 'ASC']],
        include: [
          {
            model: Product,
            as: 'products',
            attributes: ['id', 'product_name', 'price', 'thumbnail'], // Các trường của Product cần lấy
          },
        ],
      });

      sendSuccess(res, { categories });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const categoryId = req.params.categoryId;
      const category = await Category.findByPk(categoryId, {
        include: [
          {
            model: Product,
            as: 'products',
            attributes: ['id', 'product_name', 'price', 'thumbnail'], // Các trường của Product cần lấy
          },
        ],
      });

      if (!category) {
        return sendError(res, 404, NoData);
      }

      sendSuccess(res, { category });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new CategoryController();
