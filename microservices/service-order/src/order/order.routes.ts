import express from 'express';
import {paginate, validate, verifyJWT} from "@src/shared/middleware";
import * as Validation from './validation';
import * as Handler from './order.handler';

const router = express.Router();

router.get('', verifyJWT, paginate, Handler.getAllOrdersHandler);
router.get('/:orderId', verifyJWT, validate(Validation.getOrderDetailSchema), Handler.getOrderDetailHandler);
router.post('', verifyJWT, validate(Validation.placeOrderSchema), Handler.placeOrderHandler);
router.post('/:orderId/pay', verifyJWT, validate(Validation.payOrderSchema), Handler.payOrderHandler);
router.post('/v2/:orderId/pay', verifyJWT, validate(Validation.payOrderSchema), Handler.payOrderHandler);
router.post('/:orderId/cancel', verifyJWT, validate(Validation.cancelOrderSchema), Handler.cancelOrderHandler);
router.post('/v2/:orderId/cancel', verifyJWT, validate(Validation.cancelOrderSchema), Handler.cancelOrderHandlerV2);

export default router;