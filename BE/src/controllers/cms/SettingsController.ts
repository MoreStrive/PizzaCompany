// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import ModelSetting from '@models/setting';

// class SettingController {
//   public async show (req: Request, res: Response) {
//     try {
//       const setting = await ModelSetting.model.findOne();
//       if (!setting) {
//         const newSetting = await ModelSetting.model.create({
//           companyName: null,
//           phoneNumber: null,
//           email: null,
//           address: null,
//           map: null,
//           logo: null,
//         });
//         sendSuccess(res, { setting: newSetting });
//       } else {
//         sendSuccess(res, { setting });
//       }
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async update (req: Request, res: Response) {
//     try {
//       const params = req.body;
//       const setting = await ModelSetting.model.findOne();
//       const record = await setting.update(params);
//       sendSuccess(res, { setting: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new SettingController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import Setting from '@models/Setting';

class SettingController {
  public async show (req: Request, res: Response) {
    try {
      let setting = await Setting.findOne();
      if (!setting) {
        setting = await Setting.create({
          company_name: null,
          phone_number: null,
          email: null,
          address: null,
          map: null,
        });
      }

      sendSuccess(res, { setting });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.body;
      let setting = await Setting.findOne();
      if (!setting) {
        setting = await Setting.create(params);
      } else {
        await setting.update(params);
      }
      sendSuccess(res, { setting });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SettingController();
