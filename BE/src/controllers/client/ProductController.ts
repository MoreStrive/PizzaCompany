// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import Product from '@models/Product';
// import { NoData } from '@libs/errors';

// class ProductController {
//   public async index (req: Request, res: Response) {
//     try {
//       const { category, freeWord } = req.query;
//       const queryString: any = {
//         status: Product.STATUS_ENUM.ACTIVE,
//       };
//       if (category) {
//         queryString.categoryCode = category;
//       }
//       if (freeWord) {
//         queryString.$or = [
//           { title: { $regex: freeWord } },
//           { content: { $regex: freeWord } },
//           { description: { $regex: freeWord } },
//         ];
//       }
//       const products = await Product.model.find(queryString).sort({ createdAt: -1 }).lean();

//       sendSuccess(res, { products });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async getAll (req: Request, res: Response) {
//     try {
//       const { freeWord } = req.query;
//       const queryString: any = {};
//       if (freeWord) {
//         queryString.$or = [
//           { title: { $regex: freeWord } },
//           { content: { $regex: freeWord } },
//           { description: { $regex: freeWord } },
//         ];
//       }
//       const products = await Product.model.find(queryString).sort({ createdAt: -1 }).lean();
//       sendSuccess(res, { products });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async show (req: Request, res: Response) {
//     try {
//       const queryStringProduct: any = {
//         _id: req.params.productId,
//         status: Product.STATUS_ENUM.ACTIVE,
//       };
//       const product = await Product.model.findOne(queryStringProduct).lean();
//       if (!product) {
//         return sendError(res, 404, NoData);
//       }

//       sendSuccess(res, { product });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new ProductController();

import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Product from '@models/Product';
import ProductOption from '@models/ProductOption';
import ProductSize from '@models/ProductSize';
import ProductTopping from '@models/ProductTopping';
import { NoData } from '@libs/errors';

class ProductController {
  // Lấy danh sách sản phẩm với tùy chọn lọc
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const offset = (page - 1) * limit;

      const { freeWord, category } = req.query;

      const where: any = {
        status: 'active',
      };

      if (category) where.category_id = category;
      if (freeWord) {
        where[Op.or] = [
          { product_name: { [Op.like]: `%${freeWord}%` } },
          { description: { [Op.like]: `%${freeWord}%` } },
          { content: { [Op.like]: `%${freeWord}%` } },
        ];
      }

      const { rows: products, count: total } = await Product.findAndCountAll({
        where,
        offset,
        limit,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: ProductOption,
            as: 'options',
          },
          {
            model: ProductTopping,
            as: 'toppings',
          },
          {
            model: ProductSize,
            as: 'sizes',
          },
        ],
      });

      sendSuccess(res, { products, pagination: { total, page, limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async getAll (req: Request, res: Response) {
    try {
      const { freeWord } = req.query;

      const whereClause: any = {
        isDelete: false,
      };

      // Nếu có từ khóa tìm kiếm, thêm điều kiện lọc
      if (freeWord) {
        whereClause[Op.or] = [
          { product_name: { [Op.like]: `%${freeWord}%` } },
          { content: { [Op.like]: `%${freeWord}%` } },
          { description: { [Op.like]: `%${freeWord}%` } },
        ];
      }

      // Lấy tất cả sản phẩm
      const products = await Product.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
      });

      sendSuccess(res, { products });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  // Hiển thị chi tiết sản phẩm theo ID
  public async show (req: Request, res: Response) {
    try {
      // Lấy sản phẩm theo ID
      const product: any = await Product.findByPk(req.params.productId, {
        include: [
          {
            model: ProductOption,
            as: 'options',
          },
          {
            model: ProductTopping,
            as: 'toppings',
          },
          {
            model: ProductSize,
            as: 'sizes',
          },
        ],
      });
      if (!product) {
        return sendError(res, 404, NoData);
      }

      sendSuccess(res, { product });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ProductController();
