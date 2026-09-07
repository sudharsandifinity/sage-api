import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  listUsersHandler,
  updateUserHandler,
} from './users.controller.js';
import {
  createUserBodySchema,
  updateUserBodySchema,
  userIdParamSchema,
} from './users.schema.js';

export const usersRouter = Router();

usersRouter.get('/', listUsersHandler);

usersRouter.post('/', validate({ body: createUserBodySchema }), createUserHandler);

usersRouter.get('/:id', validate({ params: userIdParamSchema }), getUserHandler);

usersRouter.put(
  '/:id',
  validate({ params: userIdParamSchema, body: updateUserBodySchema }),
  updateUserHandler,
);

usersRouter.delete('/:id', validate({ params: userIdParamSchema }), deleteUserHandler);
