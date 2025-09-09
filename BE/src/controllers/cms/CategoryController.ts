// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import CategoryModel from '@models/Category';
// import ProductModel from '@models/Product';
// import { NoData } from '@libs/errors';

// class CategoryController {
//   public async create (req: Request, res: Response) {
//     try {
//       const params = req.body;
//       const category = await CategoryModel.model.create({
//         thumbnail: params.thumbnail,
//         title: params.title,
//         slug: params.slug,
//         order: params.order,
//       });
//       sendSuccess(res, { category });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async index (req: Request, res: Response) {
//     try {
//       const { type } = req.query;
//       let queryString = {};
//       if (type) queryString = Object.assign(queryString, { type });
//       const categories = await CategoryModel.model.find(queryString).sort({ order: 1 });
//       sendSuccess(res, { categories });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async show (req: Request, res: Response) {
//     try {
//       const category = await CategoryModel.model.findById(req.params.categoryId);
//       if (!category) {
//         return sendError(res, 404, NoData);
//       }
//       sendSuccess(res, { category });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async update (req: Request, res: Response) {
//     try {
//       const category = await CategoryModel.model.findById(req.params.categoryId);
//       if (!category) {
//         return sendError(res, 404, NoData);
//       }
//       const params = req.body;
//       await category.update({
//         thumbnail: params.thumbnail || category.get('thumbnail'),
//         title: params.title || category.get('title'),
//         type: params.type || category.get('type'),
//         slug: params.slug || category.get('slug'),
//         order: params.order || category.get('order'),
//       });
//       const result = await CategoryModel.model.findById(req.params.categoryId);
//       sendSuccess(res, { category: result });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async delete (req: Request, res: Response) {
//     try {
//       const category = await CategoryModel.model.findById(req.params.categoryId);
//       if (!category) {
//         return sendError(res, 404, NoData);
//       }
//       const products = await ProductModel.model.find({ categoryCode: req.params.categoryId }).lean();
//       if (products.length === 0) {
//         await category.delete();
//         sendSuccess(res, { });
//       } else {
//         return sendError(res, 404, {
//           code: 500,
//           message: 'Không thể xóa khi còn tồn tại sản phẩm trong danh mục',
//         });
//       }
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new CategoryController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import Category from '@models/Category';
import Product from '@models/Product';
import { NoData } from '@libs/errors';

class CategoryController {
  /**
   * Tạo mới danh mục
   */
  public async create (req: Request, res: Response) {
    try {
      const { thumbnail, title, slug, order } = req.body;

      const category = await Category.create({
        thumbnail,
        title,
        slug,
        order,
      });

      sendSuccess(res, { category });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Lấy danh sách danh mục
   */
  public async index (req: Request, res: Response) {
    try {
      const categories = await Category.findAll({
        order: [['order', 'ASC']],
      });

      sendSuccess(res, { categories });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Lấy thông tin chi tiết của một danh mục
   */
  public async show (req: Request, res: Response) {
    try {
      const categoryId = req.params.categoryId;

      const category = await Category.findByPk(categoryId);

      if (!category) {
        return sendError(res, 404, NoData);
      }

      sendSuccess(res, { category });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Cập nhật danh mục
   */
  public async update (req: Request, res: Response) {
    try {
      const categoryId = req.params.categoryId;

      const category : any = await Category.findByPk(categoryId);

      if (!category) {
        return sendError(res, 404, NoData);
      }

      const { thumbnail, title, slug, order } = req.body;

      await category.update({
        thumbnail: thumbnail || category.thumbnail,
        title: title || category.title,
        slug: slug || category.slug,
        order: order || category.order,
      });

      sendSuccess(res, { category });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Xóa danh mục (chỉ xóa khi không có sản phẩm nào thuộc danh mục)
   */
  public async delete (req: Request, res: Response) {
    try {
      const categoryId = req.params.categoryId;

      const category = await Category.findByPk(categoryId);

      if (!category) {
        return sendError(res, 404, NoData);
      }

      // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
      const products = await Product.findAll({
        where: { category_id: categoryId },
      });

      if (products.length > 0) {
        return sendError(res, 500, {
          message: 'Không thể xóa khi còn tồn tại sản phẩm trong danh mục',
        });
      }

      await category.destroy();

      sendSuccess(res, { message: 'Danh mục đã được xóa thành công' });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new CategoryController();
