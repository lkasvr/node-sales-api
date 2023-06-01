import { Request, Response } from 'express';
// Services
import CreateSessionService from '../services/CreateSessionService';

import { instanceToInstance } from 'class-transformer';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const createSessions = new CreateSessionService();

    const session = await createSessions.execute({
      email,
      password,
    });

    return res.json(instanceToInstance(session));
  }
}
