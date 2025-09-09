// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import ComboModel from '@models/Combo';
// import ProductModel from '@models/Product';
// import { NoData } from '@libs/errors';

// class ComboController {
//   public async index (req: Request, res: Response) {
//     try {
//       const page = parseInt(req.query.page as string || '1');
//       const limit = parseInt(req.query.limit as string || '12');
//       const offset = (page - 1) * limit;

//       const combos = await ComboModel.model.find().skip(offset).limit(limit).sort({ createdAt: -1 }).lean();
//       const total = await ComboModel.model.find().count();

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
//       const combo : any = await ComboModel.model.findOne(queryString);
//       if (!combo) {
//         return sendError(res, 404, NoData);
//       }
//       const items = [];
//       for (const _product of combo.productIds) {
//         const dataHandle : any = _product;
//         const product : any = await ProductModel.model.findById(dataHandle.value).lean();
//         const totalPrice = ComboModel.getProductPrice(product, dataHandle);
//         items.push({ product: { ...product }, totalPrice, count: dataHandle.count });
//       }
//       const sumTotalProduct = items.reduce((total, item) => {
//         return total + (item.totalPrice * item.count);
//       }, 0);
//       const sumTotalProductAfterDiscount = sumTotalProduct - ((sumTotalProduct / 100) * combo.discount);
//       await combo.update({ finalPrice: sumTotalProductAfterDiscount, totalPrice: sumTotalProduct });
//       const record = await ComboModel.model.findById(req.params.comboId);
//       sendSuccess(res, { combo: record });
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
import { NoData } from '@libs/errors';
import * as _Utils from '@configs/utils';

class ComboController {
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const offset = (page - 1) * limit;

      const where: any = {
        status: 'active',
      };

      const { rows: combos, count: total } = await Combo.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: ComboProduct,
            as: 'combo_products',
            include: [
              {
                where,
                model: Product,
                as: 'product',
              },
            ],
          },
        ],
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
                where: { status: 'active' },
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
      const sumTotalProduct = items.reduce((total, item) => {
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
                where: { status: 'active' },
                model: Product,
                as: 'product',
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
}

export default new ComboController();
