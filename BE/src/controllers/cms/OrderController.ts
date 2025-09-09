// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import OrderModel from '@models/Order';
// import UserModel from '@models/User';
// import ProductModel from '@models/Product';
// import ComboModel from '@models/Combo';
// import DiscountModel from '@models/Discount';
// import MailerService from '@services/mailer';
// import { NoData } from '@libs/errors';

// class OrderController {
//   public async index (req: Request, res: Response) {
//     try {
//       const page = parseInt(req.query.page as string || '1');
//       const limit = parseInt(req.query.limit as string || '12');
//       const offset = (page - 1) * limit;
//       const { userId } = req.query;
//       const queryString: any = {};

//       if (userId) queryString.userId = userId;

//       const order : anys = await OrderModel.model.find(queryString).skip(offset).limit(limit).sort({ createdAt: -1 }).lean();
//       const total = await OrderModel.model.find(queryString).count();

//       sendSuccess(res, { orders, pagination: { total, page, limit } });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async create (req: Request, res: Response) {
//     try {
//       const { orderItems, shippingInfor, shippingFee, discount, note, userId, paymentConfirmation, paymentMethod } = req.body;
//       const user : any : any = await UserModel.model.findById(userId).lean();
//       if (!user) {
//         return sendError(res, 404, NoData);
//       }

//       const items = [];
//       for (const _product of orderItems) {
//         const dataHandle : any = _product;
//         if (dataHandle.type === OrderModel.ORDER_TYPE_ENUM.PRODUCT) {
//           const product : any = await ProductModel.model.findById(dataHandle.value).lean();
//           const totalPrice = OrderModel.getProductPrice(product, dataHandle);
//           _product.totalPrice = totalPrice;
//           items.push({ product: { ...product }, totalPrice, count: dataHandle.count });
//         } else if (dataHandle.type === OrderModel.ORDER_TYPE_ENUM.COMBO) {
//           const combo : any = await ComboModel.model.findById(dataHandle.value).lean();
//           const totalPrice = OrderModel.getComboPrice(combo);
//           _product.totalPrice = totalPrice;
//           items.push({ product: { ...combo }, totalPrice, count: dataHandle.count });
//         }
//       }

//       const cost = items.reduce((total, item) => {
//         return total + (item.totalPrice * item.count);
//       }, 0);

//       let totalPrice : number = 0;
//       switch (user.get('customerClass')) {
//         case 'Silver':
//           totalPrice = cost - ((cost / 100) * 1); // percent
//           break;
//         case 'Gold':
//           totalPrice = cost - ((cost / 100) * 2); // percent
//           break;
//         case 'Diamond':
//           totalPrice = cost - ((cost / 100) * 3); // percent
//           break;
//         default:
//           totalPrice = cost;
//       }

//       let finalPrice : number = totalPrice;
//       if (discount?.discount) {
//         switch (discount?.discount.type) {
//           case DiscountModel.DISCOUNT_ENUM.PERCENT:
//             finalPrice = totalPrice - ((totalPrice / 100) * discount.discount?.value);
//             break;
//           case DiscountModel.DISCOUNT_ENUM.CASH:
//             finalPrice = totalPrice - discount.discount?.value;
//             break;
//           default:
//             finalPrice = totalPrice;
//         }
//       }

//       const order : any = await OrderModel.model.create({
//         userId: user.get('_id'),
//         status: OrderModel.STATUS_ENUM.PENDING,
//         createBy: OrderModel.CREATE_BY_ENUM.USER,
//         orderItems: orderItems,
//         shippingInfor,
//         shippingFee,
//         note,
//         paymentConfirmation,
//         paymentMethod,
//         totalPrice: cost,
//         finalPrice: finalPrice + shippingFee,
//         discount: discount,
//       });
//       // MailerService.orderSuccess(user.get('email'), order);
//       sendSuccess(res, { order });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async show (req: Request, res: Response) {
//     try {
//       const queryString: any = {
//         _id: req.params.orderId,
//       };
//       const order : any : any = await OrderModel.model.findOne(queryString);
//       if (!order) {
//         return sendError(res, 404, NoData);
//       }
//       sendSuccess(res, { order });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async updateStatus (req: Request, res: Response) {
//     try {
//       const queryString: any = {
//         _id: req.params.orderId,
//       };
//       const order : any : any = await OrderModel.model.findOne(queryString);
//       if (!order) {
//         return sendError(res, 404, NoData);
//       }

//       const { status } = req.body;

//       if (status === OrderModel.STATUS_ENUM.SUCCESS) {
//         const currentOrder = order;
//         const user : any = await UserModel.model.findById(currentOrder.userId);
//         if (!user) {
//           return sendError(res, 404, NoData);
//         }
//         const curerntUser : any = user;
//         await user.update({
//           accumulatedPoint: curerntUser.accumulatedPoint + currentOrder.totalPrice,
//         });
//       }

//       await order.update({ status: status });
//       const record = await OrderModel.model.findById(req.params.orderId);
//       sendSuccess(res, { order: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async exportToEmail (req: Request, res: Response) {
//     try {
//       const { userId } = req.body;
//       const user : any : any = await UserModel.model.findById(userId).lean();
//       if (!user) {
//         return sendError(res, 404, NoData);
//       }
//       const queryString: any = {
//         _id: req.params.orderId,
//       };
//       const order : any : any = await OrderModel.model.findOne(queryString);
//       if (!order) {
//         return sendError(res, 404, NoData);
//       }
//       MailerService.exportOrder(user.get('email'), order);
//       sendSuccess(res, { status: true });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }

// export default new OrderController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import Order from '@models/Order';
import User from '@models/User';
import Product from '@models/Product';
import OrderItem from '@models/OrderItem';
import Combo from '@models/Combo';
import MailerService from '@services/mailer';
import ProductOption from '@models/ProductOption';
import ProductSize from '@models/ProductSize';
import ProductTopping from '@models/ProductTopping';
import Discount from '@models/Discount';
import ComboProduct from '@models/ComboProduct';
import { NoData } from '@libs/errors';
import _Constants from '@configs/constants';

class OrderController {
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const offset = (page - 1) * limit;

      const { userId } = req.query;
      const where: any = {};
      if (userId) where.user_id = userId;
      const { rows: orders, count: total } = await Order.findAndCountAll({
        where,
        offset,
        limit,
        order: [['created_at', 'DESC']],
      });

      sendSuccess(res, { orders, pagination: { total, page, limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const order: any = await Order.findByPk(req.params.orderId, {
        include: [
          {
            model: OrderItem,
            as: 'order_items',
            include: [
              {
                model: Product,
                as: 'product',
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
              },
              {
                model: Combo,
                as: 'combo',
                include: [
                  {
                    model: ComboProduct,
                    as: 'combo_products',
                    include: [
                      {
                        model: Product,
                        as: 'product',
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
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: Discount,
            as: 'discount',
          },
        ],
      });

      if (!order) return sendError(res, 404, NoData);

      sendSuccess(res, { order });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async updateStatus (req: Request, res: Response) {
    try {
      const order : any = await Order.findByPk(req.params.orderId);
      if (!order) return sendError(res, 404, NoData);

      const { status } = req.body;

      if (status === _Constants.ORDER_STATUS_ENUM.SUCCESS) {
        const currentOrder = order;
        const user : any = await User.findByPk(currentOrder.user_id);

        if (!user) {
          return sendError(res, 404, NoData);
        }

        const curerntUser : any = user;
        await user.update({
          accumulated_point: curerntUser.accumulated_point + currentOrder.total_price,
        });
      }

      await order.update({ status });
      sendSuccess(res, { order });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async exportToEmail (req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const user : any = await User.findByPk(userId);
      if (!user) return sendError(res, 404, NoData);

      const order : any = await Order.findByPk(req.params.orderId);
      if (!order) return sendError(res, 404, NoData);

      MailerService.exportOrder(user.email, order);
      sendSuccess(res, { status: true });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new OrderController();
