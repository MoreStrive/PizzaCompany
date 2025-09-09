// import { sendError, sendSuccess } from '@libs/response';
// import { Request, Response } from 'express';
// import ContactModel from '@models/Contact';

// class ContactController {
//   public async create (req: Request, res: Response) {
//     try {
//       const params = req.body;
//       const contact = await ContactModel.model.create(params);
//       sendSuccess(res, { contact });
//     } catch (error) {
//       sendError(res, 500, error.message, error);
//     }
//   }
// }
// export default new ContactController();

import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import ContactModel from '@models/Contact';

class ContactController {
  public async create (req: Request, res: Response) {
    try {
      const { fullname, email, content } = req.body;
      const contact = await ContactModel.create({
        fullname,
        phone_number: req.body?.phone_number,
        email,
        content,
        status: 'unProcessed',
      });

      sendSuccess(res, { contact });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ContactController();
