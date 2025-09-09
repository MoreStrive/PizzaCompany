// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import OrderModel from '@models/Order';
// const moment = require('moment');

// class DashboardController {
//   public async index (req: Request, res: Response) {
//     try {
//       const { dateFrom, dateTo, date: dateQuery } = req.query;
//       const queryString : any = {};

//       if (dateFrom && dateTo) {
//         Object.assign(queryString, {
//           $match: {
//             $and: [
//               { createdAt: { $gte: moment(dateFrom).toDate() } },
//               { createdAt: { $lte: moment(dateTo).toDate() } },
//             ],
//           },
//         });
//       } else {
//         const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
//         Object.assign(queryString, { $match: { createdAt: { $gte: thirtyDaysAgo } } });
//       }

//       const _orders = await OrderModel.model.aggregate([
//         { ...queryString },
//         {
//           $group: {
//             _id: { $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } },
//             totalPrice: { $sum: '$totalPrice' },
//             finalPrice: {
//               $sum: {
//                 $cond: [
//                   { $eq: ['$status', OrderModel.STATUS_ENUM.SUCCESS] },
//                   '$finalPrice',
//                   0,
//                 ],
//               },
//             },
//             orderCount: { $sum: 1 }, // Tổng số đơn hàng
//             successfulOrdersCount: { $sum: { $cond: [{ $eq: ['$status', OrderModel.STATUS_ENUM.SUCCESS] }, 1, 0] } },
//           },
//         },
//         { $sort: { '_id': 1 } },
//       ]);
//       const $orders : any = _orders;

//       const finalPrice = $orders.reduce((total : any, order : any) => {
//         return total + order.finalPrice;
//       }, 0);
//       const orderCount = $orders.reduce((total : any, order : any) => {
//         return total + order.orderCount;
//       }, 0);
//       const successCount = $orders.reduce((total : any, order : any) => {
//         return total + order.successfulOrdersCount;
//       }, 0);

//       const todayQueryString : any = {};
//       if (dateQuery) {
//         Object.assign(todayQueryString, {
//           $and: [
//             { createdAt: { $gte: moment(dateQuery) } },
//             { createdAt: { $lte: moment(dateQuery).add(1, 'days') } },
//           ],
//         });
//       } else {
//         todayQueryString.createdAt = { $gte: moment().startOf('day'), $lte: moment().endOf('day') };
//       }

//       const _todayOrders = await OrderModel.model.find(todayQueryString);

//       const $$orders : any = _todayOrders;

//       const todayFinalPrice = $$orders.reduce((total : any, order : any) => {
//         return total + order.finalPrice;
//       }, 0);
//       const todayOrderCount = $$orders.length || 0;
//       const todaySuccessCount = $$orders.filter((order : any) => order.status === OrderModel.STATUS_ENUM.SUCCESS).length || 0;

//       sendSuccess(res, { dashboard: { orderCount, successCount, finalPrice, orders: _orders, todayOrderCount, todaySuccessCount, todayFinalPrice } });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }

// export default new DashboardController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import Order from '@models/Order';
import { Op, fn, col, literal } from 'sequelize';
import moment from 'moment';

class DashboardController {
  public async index (req: Request, res: Response) {
    try {
      const { dateFrom, dateTo, date: dateQuery }: any = req.query;
      console.log('dateFrom:', moment(dateFrom).isValid() ? moment(dateFrom).format() : 'Invalid');
      console.log('dateTo:', moment(dateTo).isValid() ? moment(dateTo).format() : 'Invalid');
      console.log('dateQuery:', moment(dateQuery).isValid() ? moment(dateQuery).format() : 'Invalid');
      const isValidDate = (date: string) => moment(date, 'YYYY-MM-DD', true).isValid();

      const where: any = {
        status: {
          [Op.ne]: 'denied',
        },
      };

      // Lọc theo khoảng thời gian
      if (dateFrom && dateTo && isValidDate(dateFrom) && isValidDate(dateTo)) {
        where.created_at = {
          [Op.gte]: moment(dateFrom).startOf('day').toDate(),
          [Op.lte]: moment(dateTo).endOf('day').toDate(),
        };
      } else {
        where.created_at = {
          [Op.gte]: moment().subtract(30, 'days').startOf('day').toDate(),
        };
      }

      const orders = await Order.findAll({
        where,
        attributes: [
          [fn('DATE_FORMAT', col('created_at'), '%d/%m/%Y'), 'date'],
          [fn('SUM', col('total_price')), 'totalPrice'],
          [
            fn(
              'SUM',
              literal('CASE WHEN status = \'success\' THEN final_price ELSE 0 END'),
            ),
            'finalPrice',
          ],
          [fn('COUNT', '*'), 'orderCount'],
          [
            fn(
              'SUM',
              literal('CASE WHEN status = \'success\' THEN 1 ELSE 0 END'),
            ),
            'successfulOrdersCount',
          ],
        ],
        group: ['date'],
        order: [[literal('date'), 'ASC']],
        raw: true,
      });

      const finalPrice = orders.reduce((total, order: any) => total + parseFloat(order.finalPrice || 0), 0);
      const orderCount = orders.reduce((total, order: any) => total + parseInt(order.orderCount || 0), 0);
      const successCount = orders.reduce((total, order: any) => total + parseInt(order.successfulOrdersCount || 0), 0);

      const todayWhere: any = {
        status: {
          [Op.ne]: 'denied',
        },
      };

      if (dateQuery && isValidDate(dateQuery)) {
        todayWhere.created_at = {
          [Op.gte]: moment(dateQuery).startOf('day').toDate(),
          [Op.lte]: moment(dateQuery).endOf('day').toDate(),
        };
      } else {
        todayWhere.created_at = {
          [Op.gte]: moment().startOf('day').toDate(),
          [Op.lte]: moment().endOf('day').toDate(),
        };
      }

      const todayOrders = await Order.findAll({ where: todayWhere, raw: true });

      const todayFinalPrice = todayOrders.reduce((total, order: any) => total + parseFloat(order.final_price || 0), 0);
      const todayOrderCount = todayOrders.length;
      const todaySuccessCount = todayOrders.filter((order: any) => order.status === 'success').length;

      sendSuccess(res, {
        dashboard: {
          orderCount,
          successCount,
          finalPrice,
          orders,
          todayOrderCount,
          todaySuccessCount,
          todayFinalPrice,
        },
      });
    } catch (error: any) {
      console.error('Error:', error);
      sendError(res, 500, error.message, error);
    }
  }
}

export default new DashboardController();
