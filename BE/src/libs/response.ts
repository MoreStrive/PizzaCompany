import { Response } from 'express';

export const sendSuccess = (res: Response, data: { [key: string]: any }, message: string = '') => {
  res.status(200).json({ message, data });
};
export const sendError = (res: Response, code: number, error: any, errorSubject: Error = new Error()) => {
  res.status(code).json({ error });
};
