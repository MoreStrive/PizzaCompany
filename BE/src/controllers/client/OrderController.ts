import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import Order from '@models/Order';
import User from '@models/User';
import Product from '@models/Product';
import OrderItem from '@models/OrderItem';
import Combo from '@models/Combo';
import ProductOption from '@models/ProductOption';
import ProductSize from '@models/ProductSize';
import ProductTopping from '@models/ProductTopping';
import MailerService from '@services/mailer';
import { NoData, ServiceUnavailable, StatusNoUpdate } from '@libs/errors';
import * as _Utils from '@configs/utils';
import _Constants from '@configs/constants';
import Discount from '@models/Discount';
import ComboProduct from '@models/ComboProduct';

class ComboController {
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

  public async create (req: Request, res: Response) {
    try {
      const { orderItems, discount } = req.body;
      const params = req.body;
      const currentUser = req.currentUser;
      const user : any = await User.findByPk(currentUser.id);
      if (!user) return sendError(res, 404, NoData);

      const items: any[] = [];
      let cost = 0;

      for (const _product of orderItems) {
        const { type, count } = _product;
        let totalPrice = 0;

        if (type === 'PRODUCT') {
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
          const plainOrderItem = _product.get ? _product.get({ plain: true }) : _product;
          const __product = { ...plainOrderItem, product: product.get({ plain: true }), totalPrice, count };
          items.push(__product);
        } else if (type === 'COMBO') {
          const combo : any = await Combo.findByPk(_product.combo_id);
          if (!combo) continue;
          totalPrice = _Utils.getComboPrice(combo);
          _product.totalPrice = totalPrice;
          const plainOrderItem = _product.get ? _product.get({ plain: true }) : _product;
          const __product = { ...plainOrderItem, product: combo.get({ plain: true }), totalPrice, count };
          items.push(__product);
        }

        cost += totalPrice * count;
      }

      let totalPrice = cost;
      switch (user.customer_class) {
        case 'Silver':
          totalPrice -= (cost * 1) / 100;
          break;
        case 'Gold':
          totalPrice -= (cost * 2) / 100;
          break;
        case 'Diamond':
          totalPrice -= (cost * 3) / 100;
          break;
      }

      let finalPrice = totalPrice;
      if (discount.discount_type && discount.discount_value) {
        if (discount.discount_type === 'percent') {
          finalPrice -= (totalPrice * discount.discount_value) / 100;
        } else if (discount.discount_type === 'cash') {
          finalPrice -= discount.discount_value;
        }
      }

      const order : any = await Order.create({
        user_id: currentUser.id,
        status: 'pending',
        create_by: 'USER',
        shipping_name: params.shipping_name,
        shipping_phone: params.shipping_phone,
        shipping_email: params.shipping_email,
        shipping_address: params.shipping_address,
        shipping_note: params.shipping_note,
        shipping_fee: params.shipping_fee,
        payment_confirmation: params.payment_confirmation,
        payment_method: params.payment_method,
        total_price: cost,
        final_price: finalPrice + +params.shipping_fee,
        discount_id: discount.id,
      });

      const orderItemData = items.map((_product: any) => {
        return {
          order_id: order.id,
          product_id: _product.type === 'PRODUCT' ? _product.product.id : null,
          combo_id: _product.type === 'COMBO' ? _product.product.id : null,
          type: _product.type,
          size: _product.size || null,
          option: _product.option || null,
          toppings: _product.toppings ? _product.toppings : null,
          count: _product.count || 1,
          total_price: _product?.totalPrice * _product.count || 0,
        };
      });

      if (discount && discount.id) {
        const _discount = await Discount.findByPk(discount.id);
        await Promise.all([
          _discount.update({ count: discount.count - 1 }),
          user.update({
            discount_used: user.discount_used ? `${user.discount_used},${discount.code}` : discount.code,
          }),
        ]);
      }

      await OrderItem.bulkCreate(orderItemData);
      MailerService.orderSuccess(user.email, order);
      sendSuccess(res, { order });
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
      const orderId = req.params.orderId;
      const currentUser = req.currentUser;
      const order: any = await Order.findByPk(orderId);

      if (!order) {
        return sendError(res, 404, NoData);
      }
      if (order.user_id !== currentUser.id) {
        return sendError(res, 503, ServiceUnavailable);
      }
      if (![_Constants.ORDER_STATUS_ENUM.PENDING, _Constants.ORDER_STATUS_ENUM.COOKING, _Constants.ORDER_STATUS_ENUM.ACCEPT].includes(order.status)) {
        return sendError(res, 428, StatusNoUpdate);
      }
      order.status = _Constants.ORDER_STATUS_ENUM.DENIED;
      await order.save();

      sendSuccess(res, { order });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  // public async exportToEmail (req: Request, res: Response) {
  //   try {
  //     const currentUser = req.currentUser;
  //     const queryString: any = {
  //       _id: req.params.orderId,
  //     };
  //     const order : any = await Order.model.findOne(queryString);
  //     if (!order) {
  //       return sendError(res, 404, NoData);
  //     }
  //     if (order.userId !== currentUser._id) {
  //       return sendError(res, 503, ServiceUnavailable);
  //     }
  //     MailerService.exportOrder(currentUser.get('email'), order);
  //     sendSuccess(res, { status: true });
  //   } catch (error) {
  //     sendError(res, 500, error.message, error);
  //   }
  // }
}

export default new ComboController();
