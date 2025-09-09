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
// }
// export default new SettingController();

import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import Setting from '@models/Setting';

class SettingController {
  /**
   * Lấy thông tin cài đặt hệ thống hoặc tạo mới nếu chưa tồn tại
   */
  public async show (req: Request, res: Response) {
    try {
      // Tìm bản ghi settings đầu tiên
      let setting = await Setting.findOne();

      // Tạo mới nếu không tìm thấy
      if (!setting) {
        setting = await Setting.create({
          companyName: null,
          phoneNumber: null,
          email: null,
          address: null,
          map: null,
          logo: null,
        });
      }

      sendSuccess(res, { setting });
    } catch (error) {
      sendError(res, 500, 'Lỗi hệ thống', error);
    }
  }
}

export default new SettingController();
