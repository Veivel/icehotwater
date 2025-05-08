import express from "express";
import {paginate, validate, verifyJWT} from "@src/shared/middleware";
import * as Validation from './validation';
import * as Handler from './wishlist.handler';

const router = express.Router();

router.get('/', verifyJWT, paginate, Handler.getAllUserWishlistHandler);
router.get('/:id', verifyJWT, validate(Validation.getWishlistByIdSchema), Handler.getWishlistByIdHandler);
router.get('/v2/:id', verifyJWT, validate(Validation.getWishlistByIdSchema), Handler.getWishlistByIdHandlerV2);
router.post('/', verifyJWT, validate(Validation.createWishlistSchema), Handler.createWishlistHandler);
router.put('/:id', verifyJWT, validate(Validation.updateWishlistSchema), Handler.updateWishlistHandler);
router.delete('/remove', verifyJWT, validate(Validation.removeProductFromWishlistSchema), Handler.removeProductFromWishlistHandler);
router.delete('/:id', verifyJWT, validate(Validation.deleteWishlistSchema), Handler.deleteWishlistHandler);
router.post('/add', verifyJWT, validate(Validation.addProductToWishlistSchema), Handler.addProductToWishlistHandler);

export default router;