import { Router } from 'express';
import multer from 'multer';
import uploadConifg from '@config/upload';
// Controller
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';
// Validation
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';

const usersRouter = Router();
const usersController = new UsersController();
const usersAvatarControler = new UserAvatarController();

const upload = multer(uploadConifg);

usersRouter.get('/', isAuthenticated, usersController.index);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  usersAvatarControler.update,
);

export default usersRouter;
