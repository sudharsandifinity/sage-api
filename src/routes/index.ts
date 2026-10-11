import { Router } from 'express';
import { customerOutstandingRouter } from '../modules/customerOutstanding/customerOutstanding.routes.js';
import { customerReturnsRouter } from '../modules/customerReturns/customerReturns.routes.js';
import { customersRouter } from '../modules/customers/customers.routes.js';
import { itemsRouter } from '../modules/items/items.routes.js';
import { priceListsRouter } from '../modules/priceLists/priceLists.routes.js';
import { purchaseOrdersRouter } from '../modules/purchaseOrders/purchaseOrders.routes.js';
import { salesOrdersRouter } from '../modules/salesOrders/salesOrders.routes.js';
import { usersRouter } from '../modules/users/users.routes.js';

export const apiRouter = Router();

apiRouter.use('/customer-outstanding', customerOutstandingRouter);
apiRouter.use('/customer-returns', customerReturnsRouter);
apiRouter.use('/customers', customersRouter);
apiRouter.use('/items', itemsRouter);
apiRouter.use('/price-lists', priceListsRouter);
apiRouter.use('/purchase-orders', purchaseOrdersRouter);
apiRouter.use('/sales-orders', salesOrdersRouter);
apiRouter.use('/users', usersRouter);
