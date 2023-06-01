// Typeorm
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../typeorm/repositories/UsersRepository';
// App
import User from '../typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  session: { user: User; token: string };
}

class CreateSessionService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByEmail(email);

    if (!user)
      throw new AppError('Incorrect email or password combination.', 401);

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed)
      throw new AppError('Incorrect email or password combination.', 401);

    const token = sign(
      { user: { name: user.name, email: user.email } },
      authConfig.jwt.secret,
      {
        subject: user.id,
        expiresIn: authConfig.jwt.expiresIn,
      },
    );

    return { session: { user, token } };
  }
}

export default CreateSessionService;
