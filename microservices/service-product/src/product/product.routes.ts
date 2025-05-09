import express from 'express';
import { validate, verifyJWTProduct, paginate } from "@src/shared/middleware";
import { cacheMiddleware } from "@src/shared/middleware/cache"; // Import the cache middleware
import * as Validation from './validation';
import * as Handler from './product.handler';

const router = express.Router();

router.get('', paginate, cacheMiddleware(300), Handler.getAllProductsHandler); // Cache for 5 minutes
router.get('/category', paginate, cacheMiddleware(1800), Handler.getAllCategoryHandler); // Cache for 30 minutes
router.get('/:id', validate(Validation.getProductByIdSchema), cacheMiddleware(600), Handler.getProductByIdHandler); // Cache for 10 minutes
router.get('/category/:category_id', validate(Validation.getProductByCategorySchema), paginate, cacheMiddleware(600), Handler.getProductByCategoryHandler);
router.post('/many', validate(Validation.getManyProductDatasByIdSchema), Handler.getManyProductDatasByIdHandler);
router.post('', verifyJWTProduct, validate(Validation.createProductSchema), Handler.createProductHandler);
router.post('/v2', verifyJWTProduct, validate(Validation.createProductSchemaV2), Handler.createProductHandlerV2);
router.post('/category', verifyJWTProduct, validate(Validation.createCategorySchema), Handler.createCategoryHandler);
router.put('/:id', verifyJWTProduct, validate(Validation.editProductSchema), Handler.editProductHandler);
router.put('/category/:category_id', verifyJWTProduct, validate(Validation.editCategorySchema), Handler.editCategoryHandler);
router.delete('/:id', verifyJWTProduct, validate(Validation.deleteProductSchema), Handler.deleteProductHandler);
router.delete('/category/:category_id', verifyJWTProduct, validate(Validation.deleteCategorySchema), Handler.deleteCategoryHandler);

export default router;