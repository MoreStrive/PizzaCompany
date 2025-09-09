// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import MaterialHistoryModel from '@models/MaterialHistory';
// import MaterialModel from '@models/Material';
// import ModelStaffSystem from '@models/StaffSystem';

// class MaterialHistory {
//   public async create (req: Request, res: Response) {
//     try {
//       const params = req.body;
//       const materialHistory = await MaterialHistoryModel.model.create({ ...params });
//       sendSuccess(res, { materialHistory });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async index (req: Request, res: Response) {
//     try {
//       const { dateForm, dateTo, staffId } = req.query;
//       const queryString : any = {
//         materialId: req.params.materialId,
//       };

//       if (dateForm && dateTo) {
//         Object.assign(queryString, { createdAt: { $gt: dateForm, $lt: dateTo } });
//       }
//       if (staffId) {
//         Object.assign(queryString, { staffId: staffId });
//       }

//       const materialHistories = await MaterialHistoryModel.model.find(queryString)
//         .populate({
//           path: 'staffId', // Đường dẫn đến trường chứa ID của staff
//           model: ModelStaffSystem.model, // Model của staff
//         })
//         .populate({
//           path: 'materialId', // Đường dẫn đến trường chứa ID của material
//           model: MaterialModel.model, // Model của material
//         });
//       sendSuccess(res, { materialHistories });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new MaterialHistory();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import MaterialHistory from '@models/MaterialHistory';
import Material from '@models/Material';
import StaffSystem from '@models/StaffSystem';

class MaterialHistoryController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;

      const materialHistory = await MaterialHistory.create({ ...params });

      sendSuccess(res, { materialHistory });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const { dateForm, dateTo, staffId } = req.query;
      const materialId = req.params.materialId;

      const where: any = { material_id: materialId };

      if (dateForm && dateTo) {
        where.created_at = {
          $gt: new Date(dateForm as string),
          $lt: new Date(dateTo as string),
        };
      }

      if (staffId) {
        where.staff_id = staffId;
      }

      const materialHistories = await MaterialHistory.findAll({
        where,
        include: [
          {
            model: StaffSystem,
            as: 'staff',
            attributes: ['id', 'full_name', 'avatar', 'role'],
          },
          {
            model: Material,
            as: 'material',
            attributes: ['id', 'title', 'code', 'unit', 'quantity'],
          },
        ],
        order: [['created_at', 'DESC']],
      });

      sendSuccess(res, { materialHistories });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new MaterialHistoryController();
