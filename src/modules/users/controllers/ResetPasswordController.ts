import { Request, Response } from 'express';
// Services
import ResetPasswordService from '../services/ResetPasswordService';

export default class ResetPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { password, token } = req.body;
    const resetPasswordEmail = new ResetPasswordService();

    await resetPasswordEmail.execute({ password, token });

    return res.status(204).json();
  }
}
