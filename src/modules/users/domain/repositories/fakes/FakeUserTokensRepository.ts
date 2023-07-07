import { v4 as uuidv4 } from 'uuid';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import { IUserToken } from '../../models/IUserToken';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async findByToken(token: string): Promise<IUserToken | undefined> {
    const userToken = this.userTokens.find(userToken => userToken.token === token);
    return userToken;
  }

  public async generate(user_id: string): Promise<IUserToken> {
    const userToken = new UserToken();

    userToken.id = uuidv4();
    userToken.token = uuidv4();
    userToken.user_id = user_id;

    this.userTokens.push(userToken);

    return userToken;
  }
}

export default FakeUserTokensRepository;
