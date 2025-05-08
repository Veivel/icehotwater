import express from 'express';
import {paginate, validate, verifyJWT} from "@src/shared/middleware";
import * as Validation from './validation';
import * as Handler from './cart.handler';

const router = express.Router();

router.get('', verifyJWT, paginate, Handler.getAllCartItemsHandler);
router.post('', verifyJWT, validate(Validation.addItemToCartSchema), Handler.addItemToCartHandler);
router.put('', verifyJWT, validate(Validation.editCartItemSchema), Handler.editCartItemHandler);
router.delete('', verifyJWT, validate(Validation.deleteCartItemSchema), Handler.deleteCartItemHandler);
router.delete('/v2', verifyJWT, validate(Validation.deleteCartItemSchema), Handler.deleteCartItemHandlerV2);

export default router;