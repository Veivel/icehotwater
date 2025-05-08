import express from 'express';
import { validate, verifyJWTProduct, paginate } from "@src/shared/middleware";
import * as Validation from './validation';
import * as Handler from './product.handler';

const router = express.Router();

router.get('', paginate, Handler.getAllProductsHandler);
router.get('/category', paginate, Handler.getAllCategoryHandler);
router.get('/:id', validate(Validation.getProductByIdSchema), Handler.getProductByIdHandler);
router.post('/many', validate(Validation.getManyProductDatasByIdSchema), Handler.getManyProductDatasByIdHandler);
router.get('/category/:category_id', validate(Validation.getProductByCategorySchema), paginate, Handler.getProductByCategoryHandler);
router.post('', verifyJWTProduct, validate(Validation.createProductSchema), Handler.createProductHandler);
router.post('/v2', verifyJWTProduct, validate(Validation.createProductSchemaV2), Handler.createProductHandlerV2);
router.post('/category', verifyJWTProduct, validate(Validation.createCategorySchema), Handler.createCategoryHandler);
router.put('/:id', verifyJWTProduct, validate(Validation.editProductSchema), Handler.editProductHandler);
router.put('/category/:category_id', verifyJWTProduct, validate(Validation.editCategorySchema), Handler.editCategoryHandler);
router.delete('/:id', verifyJWTProduct, validate(Validation.deleteProductSchema), Handler.deleteProductHandler);
router.delete('/category/:category_id', verifyJWTProduct, validate(Validation.deleteCategorySchema), Handler.deleteCategoryHandler);

export default router;