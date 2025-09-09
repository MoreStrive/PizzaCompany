// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import CartModel from '@models/Cart';
// import ProductModel from '@models/Product';
// import ComboModel from '@models/Combo';
// import { NoData, ServiceUnavailable } from '@libs/errors';

// class CartController {
//   public async show (req: Request, res: Response) {
//     try {
//       const cart : any = await CartModel.model.findOne({ userId: req.params.userId }).lean();
//       if (!cart) {
//         const initCart : any = {
//           userId: req.params.userId,
//           productIds: [],
//         };
//         await CartModel.model.create({
//           ...initCart,
//         });
//         sendSuccess(res, { cart: initCart });
//       } else {
//         const items = [];
//         for (const _product of cart.productIds) {
//           const dataHandle : any = _product;
//           if (dataHandle.type === CartModel.PRODUCT_TYPE_ENUM.PRODUCT) {
//             const product : any = await ProductModel.model.findById(dataHandle.value).lean();
//             const totalPrice = CartModel.getProductPrice(product, dataHandle);
//             _product.totalPrice = totalPrice;
//             items.push({ product: { ...product }, ...dataHandle, totalPrice, count: dataHandle.count });
//           } else if (dataHandle.type === CartModel.PRODUCT_TYPE_ENUM.COMBO) {
//             const combo : any = await ComboModel.model.findById(dataHandle.value).lean();
//             const totalPrice = CartModel.getComboPrice(combo);
//             _product.totalPrice = totalPrice;
//             items.push({ combo: { ...combo }, ...dataHandle, totalPrice, count: dataHandle.count });
//           }
//         }

//         sendSuccess(res, { cart: [...items] });
//       }
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async update (req: any, res: Response) {
//     try {
//       const currentUser = req.currentUser;
//       if (!currentUser) return sendError(res, 503, ServiceUnavailable);
//       const queryString: any = {
//         userId: currentUser._id,
//       };
//       const cart = await CartModel.model.findOne(queryString);
//       if (!cart) {
//         return sendError(res, 404, NoData);
//       }
//       const { productIds } = req.body;
//       await cart.update({
//         productIds: productIds,
//       });
//       const record = await CartModel.model.findOne(queryString);
//       sendSuccess(res, { cart: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new CartController();

import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import Cart from '@models/Cart';
import CartItem from '@models/CartItem';
import Product from '@models/Product';
import Combo from '@models/Combo';
import ProductOption from '@models/ProductOption';
import ProductSize from '@models/ProductSize';
import ProductTopping from '@models/ProductTopping';
import ComboProduct from '@models/ComboProduct';
import { NoData, ServiceUnavailable } from '@libs/errors';
import * as _Utils from '@configs/utils';

class CartController {
  public async show (req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      let cart : any = await Cart.findOne({
        where: { user_id: userId },
        include: [
          {
            model: CartItem,
            as: 'cart_items',
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

                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      if (!cart) {
        cart = await Cart.create({ user_id: userId });
        return sendSuccess(res, { cart: [] });
      }

      sendSuccess(res, { cart: cart.cart_items });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      if (!currentUser) return sendError(res, 503, ServiceUnavailable);

      const userId = currentUser.id;
      const cart: any = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) return sendError(res, 404, NoData);

      const newCartItems = req.body.cart_items.map((item: any) => ({
        cart_id: cart.id,
        product_id: item.product_id || null,
        combo_id: item.combo_id || null,
        type: item.type,
        size: item.size || null,
        option: item.option || null,
        toppings: item.toppings ? item.toppings : null,
        count: item.count || 1,
        total_price: item.total_price,
      }));
      await CartItem.destroy({ where: { cart_id: cart.id } });
      await CartItem.bulkCreate(newCartItems);

      const updatedCart : any = await Cart.findOne({
        where: { user_id: userId },
        include: [
          {
            model: CartItem,
            as: 'cart_items',
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

                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      const items = [];
      for (const _product of updatedCart.cart_items) {
        const { type, value, count } = _product;
        let totalPrice = 0;

        if (type === 'PRODUCT') {
          const product : any = await Product.findByPk(value, {
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
        } else if (type === 'COMBO') {
          const combo : any = await Combo.findByPk(value);
          if (!combo) continue;
          const totalPrice = _Utils.getComboPrice(combo);
          _product.totalPrice = totalPrice;
          items.push({ product: combo.toJSON(), totalPrice, count });
        }
      }
      sendSuccess(res, { cart: items });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new CartController();
