// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import ProductModel from '@models/Product';
// import ModelStaffSystem from '@models/StaffSystem';
// import OrderModel from '@models/Order';
// import { NoData, ServiceUnavailable } from '@libs/errors';

// class ProductController {
//   public async index (req: Request, res: Response) {
//     try {
//       const page = parseInt(req.query.page as string || '1');
//       const limit = parseInt(req.query.limit as string || '12');
//       const offset = (page - 1) * limit;

//       const { freeWord, category } = req.query;
//       const queryString: any = {};
//       if (category) {
//         queryString.categoryCode = category;
//       }
//       if (freeWord) {
//         Object.assign(queryString, {
//           $or: [
//             { productName: { $regex: freeWord } },
//             { description: { $regex: freeWord } },
//             { content: { $regex: freeWord } },
//           ],
//         });
//       }
//       const products = await ProductModel.model.find(queryString).skip(offset).limit(limit).sort({ createdAt: -1 }).lean();
//       const total = await ProductModel.model.find(queryString).count();

//       sendSuccess(res, { products, pagination: { total, page, limit } });
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
//       const products = await ProductModel.model.find(queryString).sort({ createdAt: -1 }).lean();
//       sendSuccess(res, { products });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async show (req: Request, res: Response) {
//     try {
//       const queryStringProduct: any = {
//         _id: req.params.productId,
//       };
//       const product : any = await ProductModel.model.findOne(queryStringProduct).lean();
//       if (!product) {
//         return sendError(res, 404, NoData);
//       }

//       sendSuccess(res, { product });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async updateCountProduct (req: Request, res: Response) {
//     try {
//       const queryString: any = {
//         _id: req.params.productId,
//       };
//       const product : any = await ProductModel.model.findOne(queryString);
//       if (!product) {
//         return sendError(res, 404, NoData);
//       }
//       const { count } = req.body;
//       await product.update({ count: count });
//       const record = await ProductModel.model.findById(req.params.productId);
//       sendSuccess(res, { product: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   // ADMIN permission
//   public async create (req: any, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       if (currentActor.role !== ModelStaffSystem.ROLE_ENUM.ADMIN) {
//         return sendError(res, 503, ServiceUnavailable);
//       }
//       const params = req.body;
//       const product : any = await ProductModel.model.create(params);
//       sendSuccess(res, { product });
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
//         _id: req.params.productId,
//       };
//       const product : any = await ProductModel.model.findOne(queryString);
//       if (!product) {
//         return sendError(res, 404, NoData);
//       }
//       const params = req.body;
//       await product.update(params);
//       const record = await ProductModel.model.findById(req.params.productId);
//       sendSuccess(res, { product: record });
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
//         _id: req.params.productId,
//       };
//       const product : any = await ProductModel.model.findOne(queryString);
//       if (!product) {
//         return sendError(res, 404, NoData);
//       }

//       const orderQueryString: any = {
//         $or: [
//           { status: OrderModel.STATUS_ENUM.COOKING },
//           { status: OrderModel.STATUS_ENUM.DELIVERING },
//           { status: OrderModel.STATUS_ENUM.ACCEPT },
//           { status: OrderModel.STATUS_ENUM.PENDING },
//         ],
//         'orderItems.value': product._id,
//       };
//       const orders = await OrderModel.model.find(orderQueryString).lean();
//       if (orders && orders.length > 0) {
//         return sendError(res, 404, {
//           code: 11,
//           message: 'Không thể xóa sản phẩm này vì có đơn hàng đang chờ',
//         });
//       } else {
//         await product.update({ isDelete: true });
//         sendSuccess(res, { status: true });
//       }
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new ProductController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import Product from '@models/Product';
import ProductOption from '@models/ProductOption';
import ProductSize from '@models/ProductSize';
import ProductTopping from '@models/ProductTopping';
import Order from '@models/Order';
import OrderItem from '@models/OrderItem';
import Rating from '@models/Rating';
import User from '@models/User';
import { NoData, ServiceUnavailable } from '@libs/errors';
import { Op } from 'sequelize';
import Combo from '@models/Combo';
import ComboProduct from '@models/ComboProduct';
import _Constants from '@configs/constants';

class ProductController {
  /**
   * Lấy danh sách sản phẩm với phân trang và bộ lọc
   */
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const offset = (page - 1) * limit;

      const { freeWord, category } = req.query;

      const where: any = {};

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
      });

      sendSuccess(res, { products, pagination: { total, page, limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
 * Lấy tất cả sản phẩm (không phân trang)
 */
  public async getAll (req: Request, res: Response) {
    try {
      const { freeWord } = req.query;
      const where: any = {
        status: 'active',
      };

      if (freeWord) {
        where[Op.or] = [
          { title: { [Op.like]: `%${freeWord}%` } },
          { description: { [Op.like]: `%${freeWord}%` } },
          { content: { [Op.like]: `%${freeWord}%` } },
        ];
      }

      const products = await Product.findAll({
        where,
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

      sendSuccess(res, { products });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Lấy thông tin chi tiết sản phẩm
   */
  public async show (req: Request, res: Response) {
    try {
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
          {
            model: Rating,
            as: 'ratings', // Liên kết với bảng Rating
            include: [
              {
                model: User,
                as: 'user', // Bao gồm thông tin người dùng đã đánh giá
                attributes: ['id', 'full_name', 'avatar'], // Chỉ lấy các trường cần thiết
              },
            ],
          },
        ],
      });

      if (!product) return sendError(res, 404, NoData);

      sendSuccess(res, { product });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Cập nhật số lượng sản phẩm
   */
  public async updateCountProduct (req: Request, res: Response) {
    try {
      const product : any = await Product.findByPk(req.params.productId);
      if (!product) return sendError(res, 404, NoData);

      const { count } = req.body;
      await product.update({ count });

      sendSuccess(res, { product });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
 * Tạo mới sản phẩm (ADMIN)
 */
  public async create (req: any, res: Response) {
    try {
      const currentActor = req.currentActor;
      if (currentActor.role !== _Constants.ROLE_ENUM.ADMIN) {
        return sendError(res, 503, ServiceUnavailable);
      }

      const { options, toppings, sizes, ...productData } = req.body;

      // Tạo sản phẩm
      const product: any = await Product.create(productData);

      // Thêm dữ liệu vào các bảng nối
      if (options && options.length > 0) {
        const productOptions = options.map((option: any) => ({
          product_id: product.id,
          ...option,
        }));
        await ProductOption.bulkCreate(productOptions);
      }

      if (toppings && toppings.length > 0) {
        const productToppings = toppings.map((topping: any) => ({
          product_id: product.id,
          ...topping,
        }));
        await ProductTopping.bulkCreate(productToppings);
      }

      if (sizes && sizes.length > 0) {
        const productSizes = sizes.map((size: any) => ({
          product_id: product.id,
          ...size,
        }));
        await ProductSize.bulkCreate(productSizes);
      }

      sendSuccess(res, { product });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
 * Cập nhật sản phẩm (ADMIN)
 */
  public async update (req: any, res: Response) {
    try {
      const currentActor = req.currentActor;
      if (currentActor.role !== _Constants.ROLE_ENUM.ADMIN) {
        return sendError(res, 503, ServiceUnavailable);
      }

      const product: any = await Product.findByPk(req.params.productId);
      if (!product) return sendError(res, 404, NoData);

      const { options, toppings, sizes, ...productData } = req.body;

      // Cập nhật sản phẩm
      await product.update(productData);

      // Xóa dữ liệu cũ trong các bảng nối
      if (options) {
        await ProductOption.destroy({ where: { product_id: product.id } });
        const productOptions = options.map((option: any) => ({
          product_id: product.id,
          ...option,
        }));
        await ProductOption.bulkCreate(productOptions);
      }

      if (toppings) {
        await ProductTopping.destroy({ where: { product_id: product.id } });
        const productToppings = toppings.map((topping: any) => ({
          product_id: product.id,
          ...topping,
        }));
        await ProductTopping.bulkCreate(productToppings);
      }

      if (sizes) {
        await ProductSize.destroy({ where: { product_id: product.id } });
        const productSizes = sizes.map((size: any) => ({
          product_id: product.id,
          ...size,
        }));
        await ProductSize.bulkCreate(productSizes);
      }

      sendSuccess(res, { product });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async updateStatus (req: Request, res: Response) {
    try {
      // Lấy productId và status từ request
      const productId = req.params.productId;
      const { status } = req.body;

      // Kiểm tra sản phẩm tồn tại
      const product: any = await Product.findByPk(productId);

      if (!product) {
        return sendError(res, 404, 'Product not found');
      }

      // Cập nhật trạng thái của sản phẩm
      product.status = status;
      await product.save();

      // Nếu trạng thái sản phẩm là 'inactive', cập nhật các combo liên quan
      if (status === 'inactive') {
        const comboProducts = await ComboProduct.findAll({
          where: { product_id: productId },
          attributes: ['combo_id'],
        });

        if (comboProducts.length > 0) {
          const comboIds = comboProducts.map((cp: any) => cp.combo_id);

          await Combo.update(
            { status: 'inactive' }, // Đặt trạng thái combo là inactive
            {
              where: {
                id: { [Op.in]: comboIds },
              },
            },
          );
        }
      }

      // Trả về kết quả thành công
      sendSuccess(res, {
        product,
        message: status === 'inactive'
          ? 'Product status updated and related combos set to inactive'
          : 'Product status updated successfully',
      });
    } catch (error: any) {
      console.error('Error in updateStatus:', error);
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Xóa sản phẩm (ADMIN)
   */
  public async delete (req: any, res: Response) {
    try {
      const currentActor = req.currentActor;
      if (currentActor.role !== _Constants.ROLE_ENUM.ADMIN) {
        return sendError(res, 503, ServiceUnavailable);
      }

      const product : any = await Product.findByPk(req.params.productId);
      if (!product) return sendError(res, 404, NoData);
      const orders = await Order.findAll({
        where: {
          status: { [Op.in]: ['cooking', 'delivering', 'accept', 'pending'] },
        },
        include: [
          {
            model: OrderItem,
            as: 'order_items',
            where: {
              'product_id': product.id,
            },
          },
        ],
      });

      if (orders.length > 0) {
        return sendError(res, 404, {
          code: 11,
          message: 'Không thể xóa sản phẩm này vì có đơn hàng đang chờ',
        });
      }

      // await product.update({ is_delete: true });
      await product.destroy();
      sendSuccess(res, { status: true });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ProductController();
