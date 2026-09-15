import { Router } from 'express';
import { customerReturnAsnImportHandler } from './customerReturns.controller.js';

export const customerReturnsRouter = Router();

customerReturnsRouter.post('/asn-import', customerReturnAsnImportHandler);
