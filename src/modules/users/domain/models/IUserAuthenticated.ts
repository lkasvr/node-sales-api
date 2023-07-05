import { IUser } from './IUser';

export interface IUserAuthenticated {
  session: {
    user: IUser;
    token: string;
  };
}
