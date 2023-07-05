import { Request, Response, NextFunction } from 'express';
// App
import AppError from '@shared/errors/AppError';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  user: { name: string; email: string };
}

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new AppError('JWT Token is missing.');

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);
    const { sub, user } = decodedToken as ITokenPayload;

    req.user = {
      id: sub,
      name: user.name,
      email: user.email,
    };

    return next();
  } catch (e) {
    throw new AppError('Ivalid JWT Token.');
  }
}
