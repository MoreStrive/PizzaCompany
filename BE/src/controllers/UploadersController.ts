import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import dayjs from 'dayjs';

class UploadController {
  public async upload (req: Request, res: Response) {
    try {
      const fileAttributes: any = [];
      const files: any[] = req.files as any[];
      await initializeApp({
        apiKey: 'AIzaSyDXMYxLIO1kCvWqrCInkW4Q3t62D6xMJMg',
        authDomain: 'todo-app-1111-77da8.firebaseapp.com',
        projectId: 'todo-app-1111-77da8',
        storageBucket: 'todo-app-1111-77da8.appspot.com',
        messagingSenderId: '1027328964829',
        appId: '1:1027328964829:web:3a6ccc3a82764a3782c334',
        measurementId: 'G-7G4GL297WT',
      });
      const storage = await getStorage();
      for (const file of files) {
        const attribute: any = {};
        const storageRef = await ref(storage, `${dayjs().format('YYYYMMDDHHmmss')}_${file.originalname}`);
        const metadata = {
          contentType: file.mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        attribute.source = downloadURL;
        attribute.originalname = file.originalname;
        attribute.size = file.size;
        attribute.type = file.mimetype.split('/')[0];
        fileAttributes.push(attribute);
      }
      sendSuccess(res, { fileAttributes });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new UploadController();
