// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import Combo from '@models/Combo';
// import ModelStaffSystem from '@models/StaffSystem';
// import Product from '@models/Product';
// import { NoData, ServiceUnavailable } from '@libs/errors';

// class ComboController {
//   public async index (req: Request, res: Response) {
//     try {
//       const page = parseInt(req.query.page as string || '1');
//       const limit = parseInt(req.query.limit as string || '12');
//       const offset = (page - 1) * limit;

//       const combos = await Combo.model.find().skip(offset).limit(limit).sort({ createdAt: -1 }).lean();
//       const total = await Combo.model.find().count();

//       sendSuccess(res, { combos, pagination: { total, page, limit } });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async show (req: any, res: Response) {
//     try {
//       const queryString: any = {
//         _id: req.params.comboId,
//       };
//       const combo : any = await Combo.model.findOne(queryString);
//       if (!combo) {
//         return sendError(res, 404, NoData);
//       }
//       const items = [];
//       for (const _product of combo.productIds) {
//         const dataHandle : any = _product;
//         const product : any = await Product.model.findById(dataHandle.value).lean();
//         const totalPrice = Combo.getProductPrice(product, dataHandle);
//         items.push({ product: { ...product }, totalPrice, count: dataHandle.count || 1 });
//       }
//       const sumTotalProduct = items.reduce((total, item) => {
//         return total + (item.totalPrice * item.count);
//       }, 0);
//       const sumTotalProductAfterDiscount = sumTotalProduct - ((sumTotalProduct / 100) * combo.discount);
//       await combo.update({ finalPrice: sumTotalProductAfterDiscount, totalPrice: sumTotalProduct });
//       const record = await Combo.model.findById(req.params.comboId);
//       sendSuccess(res, { combo: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async create (req: any, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       if (currentActor.role !== ModelStaffSystem.ROLE_ENUM.ADMIN && currentActor.role !== ModelStaffSystem.ROLE_ENUM.MANAGE) {
//         return sendError(res, 503, ServiceUnavailable);
//       }
//       const params = req.body;
//       const { productIds, discount } = req.body;

//       const items = [];
//       for (const _product of productIds) {
//         const dataHandle : any = _product;
//         const product : any = await Product.model.findById(dataHandle.value).lean();
//         const totalPrice = Combo.getProductPrice(product, dataHandle);
//         items.push({ product: { ...product }, totalPrice, count: dataHandle.count || 1 });
//       }
//       const sumTotalProduct = items.reduce((total, item) => {
//         return total + (item.totalPrice * item.count);
//       }, 0);
//       const sumTotalProductAfterDiscount = sumTotalProduct - ((sumTotalProduct / 100) * discount);
//       const combo = await Combo.model.create({ ...params, finalPrice: sumTotalProductAfterDiscount, totalPrice: sumTotalProduct });
//       sendSuccess(res, { combo });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async update (req: any, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       if (currentActor.role !== ModelStaffSystem.ROLE_ENUM.ADMIN && currentActor.role !== ModelStaffSystem.ROLE_ENUM.MANAGE) {
//         return sendError(res, 503, ServiceUnavailable);
//       }
//       const queryString: any = {
//         _id: req.params.comboId,
//       };
//       const combo = await Combo.model.findOne(queryString);
//       if (!combo) {
//         return sendError(res, 404, NoData);
//       }
//       const params = req.body;
//       const { productIds, discount } = req.body;

//       const items = [];
//       for (const _product of productIds) {
//         const dataHandle : any = _product;
//         const product : any = await Product.model.findById(dataHandle.value).lean();
//         const totalPrice = Combo.getProductPrice(product, dataHandle);
//         items.push({ product: { ...product }, totalPrice, count: dataHandle.count || 1 });
//       }
//       const sumTotalProduct = items.reduce((total, item) => {
//         return total + (item.totalPrice * item.count);
//       }, 0);
//       const sumTotalProductAfterDiscount = sumTotalProduct - ((sumTotalProduct / 100) * discount);
//       await combo.update({ ...params, finalPrice: sumTotalProductAfterDiscount, totalPrice: sumTotalProduct });
//       const record = await Combo.model.findById(req.params.comboId);
//       sendSuccess(res, { combo: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async updateCount (req: any, res: Response) {
//     try {
//       const queryString: any = {
//         _id: req.params.comboId,
//       };
//       const combo = await Combo.model.findOne(queryString);
//       if (!combo) {
//         return sendError(res, 404, NoData);
//       }
//       const { count } = req.body;
//       await combo.update({ count: count });
//       const record = await Combo.model.findById(req.params.comboId);
//       sendSuccess(res, { combo: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async delete (req: any, res: Response) {
//     try {
//       const currentActor = req.currentActor;
//       if (currentActor.role !== ModelStaffSystem.ROLE_ENUM.ADMIN && currentActor.role !== ModelStaffSystem.ROLE_ENUM.MANAGE) {
//         return sendError(res, 503, ServiceUnavailable);
//       }
//       const queryString: any = {
//         _id: req.params.comboId,
//       };
//       const combo = await Combo.model.findOne(queryString);
//       if (!combo) {
//         return sendError(res, 404, NoData);
//       }
//       await combo.delete();
//       sendSuccess(res, { status: true });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new ComboController();

import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import Combo from '@models/Combo';
import ComboProduct from '@models/ComboProduct';
import Product from '@models/Product';
import ProductOption from '@models/ProductOption';
import ProductSize from '@models/ProductSize';
import ProductTopping from '@models/ProductTopping';
import Order from '@models/Order';
import OrderItem from '@models/OrderItem';
import Rating from '@models/Rating';
import User from '@models/User';
import { NoData, ServiceUnavailable } from '@libs/errors';
import _Constants from '@configs/constants';
import { Op } from 'sequelize';
import * as _Utils from '@configs/utils';

class ComboController {
  // Kiểm tra quyền hạn của người dùng
  // public isAuthorized (actor: any): boolean {
  //   return actor.role === _Constants.ROLE_ENUM.ADMIN || actor.role === _Constants.ROLE_ENUM.MANAGER;
  // }

  // Danh sách combo với phân trang
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const offset = (page - 1) * limit;

      const { rows: combos, count: total } = await Combo.findAndCountAll({
        limit,
        offset,
        order: [['created_at', 'DESC']],
      });

      sendSuccess(res, { combos, pagination: { total, page, limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const combo: any = await Combo.findByPk(req.params.comboId, {
        include: [
          {
            model: ComboProduct,
            as: 'combo_products',
            include: [
              {
                model: Product,
                as: 'product',
              },
            ],
          },
        ],
      });
      if (!combo) return sendError(res, 404, NoData);

      const items = [];
      const { discount } = combo;

      for (const _product of combo.combo_products) {
        const { count } = _product;
        let totalPrice = 0;

        const product : any = await Product.findByPk(_product.product_id, {
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
        if (!product) continue;
        totalPrice = _Utils.getProductPrice(product, _product);
        items.push({ product: product.toJSON(), totalPrice, count });
      }

      const sumTotalProduct = items.reduce((total: any, item: any) => {
        return total + (item.totalPrice * item.count);
      }, 0);

      const sumTotalProductAfterDiscount = sumTotalProduct - ((sumTotalProduct / 100) * discount);
      await combo.update({ total_price: sumTotalProduct, final_price: sumTotalProductAfterDiscount });

      const updatedCombo = await Combo.findByPk(req.params.comboId, {
        include: [
          {
            model: ComboProduct,
            as: 'combo_products',
            include: [
              {
                model: Product,
                as: 'product',
              },
            ],
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
      sendSuccess(res, { combo: updatedCombo });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  // Tạo combo mới
  public async create (req: any, res: Response) {
    try {
      const currentActor = req.currentActor;
      const allowedRoles = [_Constants.ROLE_ENUM.ADMIN, _Constants.ROLE_ENUM.MANAGER];

      if (!allowedRoles.includes(currentActor.role)) {
        return sendError(res, 503, ServiceUnavailable);
      }

      const params = req.body;
      const items : any = [];
      const { discount } = req.body;

      for (const _product of params.combo_products) {
        const { count } = _product;
        let totalPrice = 0;

        const product : any = await Product.findByPk(_product.product_id, {
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
        if (!product) continue;
        totalPrice = _Utils.getProductPrice(product, _product);
        items.push({ product: product.toJSON(), totalPrice, count });
      }

      const sumTotalProduct = items.reduce((total: any, item: any) => {
        return total + (item.totalPrice * item.count);
      }, 0);

      const sumTotalProductAfterDiscount = sumTotalProduct - ((sumTotalProduct / 100) * discount);
      const combo : any = await Combo.create({ ...params, status: 'inactive', final_price: sumTotalProductAfterDiscount, total_price: sumTotalProduct });

      const comboProductData = params.combo_products.map((_product: any) => ({
        combo_id: combo.id,
        product_id: _product.product_id,
        size: _product.size || null,
        option: _product.option || null,
        toppings: _product.toppings,
        count: _product.count || 1,
        total_price: _product.total_price || 0,
      }));
      await ComboProduct.bulkCreate(comboProductData);

      sendSuccess(res, { combo });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  // Cập nhật combo
  public async update (req: any, res: Response) {
    try {
      const currentActor = req.currentActor;
      const allowedRoles = [_Constants.ROLE_ENUM.ADMIN, _Constants.ROLE_ENUM.MANAGER];

      if (!allowedRoles.includes(currentActor.role)) {
        return sendError(res, 503, ServiceUnavailable);
      }

      const combo : any = await Combo.findByPk(req.params.comboId);
      if (!combo) return sendError(res, 404, NoData);

      const params = req.body;
      const items = [];
      const { discount } = req.body;

      for (const _product of params.combo_products) {
        const { count } = _product;
        let totalPrice = 0;

        const product : any = await Product.findByPk(_product.product_id, {
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
        if (!product) continue;
        totalPrice = _Utils.getProductPrice(product, _product);
        items.push({ product: product.toJSON(), totalPrice, count });
      }

      await ComboProduct.destroy({ where: { combo_id: req.params.comboId } });
      if (Array.isArray(params.combo_products) && params.combo_products.length > 0) {
        const newComboProducts = params.combo_products.map((product: any) => ({
          combo_id: combo.id,
          product_id: product.product_id,
          size: product.size || null,
          option: product.option || null,
          toppings: product.toppings,
          count: product.count || 1,
          total_price: product.total_price || 0,
        }));
        await ComboProduct.bulkCreate(newComboProducts);
      }

      const sumTotalProduct = items.reduce((total, item) => {
        return total + (item.totalPrice * item.count);
      }, 0);

      const sumTotalProductAfterDiscount = sumTotalProduct - ((sumTotalProduct / 100) * discount);

      await combo.update({ ...params, final_price: sumTotalProductAfterDiscount, total_price: sumTotalProduct });

      sendSuccess(res, { combo });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async updateStatus (req: Request, res: Response) {
    try {
      // Lấy comboId từ params và status từ body
      const comboId = req.params.comboId;
      const { status } = req.body;

      // Kiểm tra combo có tồn tại không
      const combo: any = await Combo.findByPk(comboId);

      if (!combo) {
        return sendError(res, 404, 'Combo not found');
      }

      // Cập nhật trạng thái combo
      combo.status = status;
      await combo.save();

      // Nếu combo được active, active toàn bộ sản phẩm liên quan
      if (status === 'active') {
        const comboProducts = await ComboProduct.findAll({
          where: { combo_id: comboId },
          attributes: ['product_id'],
        });

        if (comboProducts.length > 0) {
          const productIds = comboProducts.map((cp: any) => cp.product_id);

          await Product.update(
            { status: 'active' }, // Cập nhật trạng thái sản phẩm
            {
              where: {
                id: { [Op.in]: productIds }, // Cập nhật cho tất cả sản phẩm trong combo
              },
            },
          );
        }
      }

      // Phản hồi thành công
      sendSuccess(res, {
        combo,
        message: status === 'active'
          ? 'Combo status updated, all related products set to active'
          : 'Combo status updated successfully',
      });
    } catch (error: any) {
      console.error('Error in updateStatus:', error);
      sendError(res, 500, error.message, error);
    }
  }

  // Xóa combo
  public async delete (req: any, res: Response) {
    try {
      const currentActor = req.currentActor;
      const allowedRoles = [_Constants.ROLE_ENUM.ADMIN, _Constants.ROLE_ENUM.MANAGER];

      if (!allowedRoles.includes(currentActor.role)) {
        return sendError(res, 503, ServiceUnavailable);
      }

      const combo : any = await Combo.findByPk(req.params.comboId);
      if (!combo) return sendError(res, 404, NoData);

      // Kiểm tra sản phẩm có trong đơn hàng đang xử lý không
      const orders = await Order.findAll({
        where: {
          status: { [Op.in]: ['cooking', 'delivering', 'accept', 'pending'] },
        },
        include: [
          {
            model: OrderItem,
            as: 'order_items', // Đảm bảo alias phải khớp với định nghĩa trong model
            where: {
              'combo_id': combo.id, // Lọc các đơn hàng có chứa sản phẩm này
            },
          },
        ],
      });

      if (orders.length > 0) {
        return sendError(res, 404, {
          code: 11,
          message: 'Không thể xóa COMBO này vì có đơn hàng đang chờ',
        });
      }

      await combo.destroy();
      // await combo.update({ is_delete: true });
      sendSuccess(res, { status: true });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ComboController();
