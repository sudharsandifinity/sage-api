import { Router } from 'express';
import { customersRouter } from '../modules/customers/customers.routes.js';
import { usersRouter } from '../modules/users/users.routes.js';

export const apiRouter = Router();

apiRouter.use('/customers', customersRouter);
apiRouter.use('/users', usersRouter);
