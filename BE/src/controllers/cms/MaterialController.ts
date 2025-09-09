// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import MaterialModel from '@models/Material';
// import { NoData } from '@libs/errors';

// class MaterialController {
//   public async create (req: Request, res: Response) {
//     try {
//       const params = req.body;
//       const material = await MaterialModel.model.create({ ...params });
//       sendSuccess(res, { material });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async index (req: Request, res: Response) {
//     try {
//       const { type, freeWord } = req.query;
//       let queryString = {};
//       if (type) queryString = Object.assign(queryString, { type });
//       if (freeWord) {
//         queryString = {
//           ...queryString,
//           $or: [
//             { title: { $regex: freeWord } },
//             { code: { $regex: freeWord } },
//           ],
//         };
//       }
//       const materials = await MaterialModel.model.find(queryString).sort({ createdAt: -1 });
//       sendSuccess(res, { materials });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async show (req: Request, res: Response) {
//     try {
//       const material = await MaterialModel.model.findById(req.params.materialId);
//       if (!material) {
//         return sendError(res, 404, NoData);
//       }
//       sendSuccess(res, { material });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async update (req: Request, res: Response) {
//     try {
//       const material = await MaterialModel.model.findById(req.params.materialId);
//       if (!material) {
//         return sendError(res, 404, NoData);
//       }
//       const params = req.body;
//       await material.update({
//         thumbnail: params.thumbnail || material.get('thumbnail'),
//         title: params.title || material.get('title'),
//         type: params.type || material.get('type'),
//         slug: params.slug || material.get('slug'),
//         quantity: +params.quantity || +material.get('quantity'),
//       });
//       const result = await MaterialModel.model.findById(req.params.materialId);
//       sendSuccess(res, { material: result });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async delete (req: Request, res: Response) {
//     try {
//       const material = await MaterialModel.model.findById(req.params.materialId);
//       if (!material) {
//         return sendError(res, 404, NoData);
//       }
//       await material.delete();
//       sendSuccess(res, { });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new MaterialController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import Material from '@models/Material';
import { NoData } from '@libs/errors';
import { Op } from 'sequelize';

class MaterialController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      const material = await Material.create({ ...params });

      sendSuccess(res, { material });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const { type, freeWord } = req.query;

      const where: any = {};
      if (type) where.unit = type;

      if (freeWord) {
        where[Op.or] = [
          { title: { [Op.like]: `%${freeWord}%` } },
          { code: { [Op.like]: `%${freeWord}%` } },
        ];
      }

      const materials = await Material.findAll({
        where,
        order: [['created_at', 'DESC']],
      });

      sendSuccess(res, { materials });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const material = await Material.findByPk(req.params.materialId);

      if (!material) {
        return sendError(res, 404, NoData);
      }

      sendSuccess(res, { material });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const material : any = await Material.findByPk(req.params.materialId);

      if (!material) {
        return sendError(res, 404, NoData);
      }

      const params = req.body;
      await material.update({
        thumbnail: params.thumbnail || material.thumbnail,
        title: params.title || material.title,
        unit: params.unit || material.unit,
        quantity: params.quantity !== undefined ? +params.quantity : material.quantity,
      });

      sendSuccess(res, { material });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const material = await Material.findByPk(req.params.materialId);

      if (!material) {
        return sendError(res, 404, NoData);
      }

      await material.destroy();

      sendSuccess(res, {});
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new MaterialController();
