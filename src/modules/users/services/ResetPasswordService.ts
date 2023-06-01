// Typeorm
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../typeorm/repositories/UsersRepository';
import { UsersTokenRepository } from '../typeorm/repositories/UsersTokensRepository';
// App
import AppError from '@shared/errors/AppError';
// Util's
import { isAfter, addHours } from 'date-fns';
import { hash } from 'bcryptjs';

interface IRequest {
  password: string;
  token: string;
}

class ResetPasswordService {
  public async execute({ password, token }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokenRepository = getCustomRepository(UsersTokenRepository);

    const userToken = await userTokenRepository.findByToken(token);

    if (!userToken) throw new AppError('User token does not exists.');

    const user = await usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('User does not exists.');

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) throw new AppError('Token expired.');

    user.password = await hash(password, 8);

    await usersRepository.save(user);
  }
}

export default ResetPasswordService;
