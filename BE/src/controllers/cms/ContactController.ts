// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import ContactModel from '@models/Contact';
// import { NoData } from '@libs/errors';

// class ContactController {
//   public async index (req: Request, res: Response) {
//     try {
//       const page = parseInt(req.query.page as string || '1');
//       const limit = parseInt(req.query.limit as string || '12');
//       const offset = (page - 1) * limit;

//       const contacts = await ContactModel.model.find().skip(offset).limit(limit).sort({ createdAt: -1 }).lean();
//       const total = await ContactModel.model.find().count();

//       sendSuccess(res, { contacts, pagination: { total, page, limit } });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }

//   public async update (req: Request, res: Response) {
//     try {
//       const queryString: any = {
//         _id: req.params.contactId,
//       };
//       const contact = await ContactModel.model.findOne(queryString);
//       if (!contact) {
//         return sendError(res, 404, NoData);
//       }
//       const params = req.body;
//       await contact.update(params);
//       const record = await ContactModel.model.findById(req.params.contactId);
//       sendSuccess(res, { product: record });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new ContactController();

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import Contact from '@models/Contact';
import { NoData } from '@libs/errors';

class ContactController {
  /**
   * Lấy danh sách liên hệ với phân trang
   */
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const offset = (page - 1) * limit;

      // Truy vấn danh sách liên hệ với phân trang
      const { rows: contacts, count: total } = await Contact.findAndCountAll({
        limit,
        offset,
        order: [['created_at', 'DESC']],
      });

      sendSuccess(res, { contacts, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  /**
   * Cập nhật thông tin liên hệ
   */
  public async update (req: Request, res: Response) {
    try {
      const contactId = req.params.contactId;

      // Tìm bản ghi liên hệ theo ID
      const contact = await Contact.findByPk(contactId);

      if (!contact) {
        return sendError(res, 404, NoData);
      }

      const params = req.body;

      // Cập nhật thông tin liên hệ
      await contact.update(params);

      sendSuccess(res, { contact });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ContactController();
