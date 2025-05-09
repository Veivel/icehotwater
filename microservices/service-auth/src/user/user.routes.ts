import express from "express";
import { validate } from "@src/shared/middleware/validate";
import { verifyJWT } from "@src/shared/middleware/verifyJWT";
import { cacheMiddleware } from "@src/shared/middleware/cache"; // Import cache middleware
import * as Validation from "./validation";
import * as Handler from "./user.handler";

const router = express.Router();

router.post("/register", validate(Validation.registerSchema), Handler.registerHandler);
router.post("/v2/register", validate(Validation.registerSchemaV2), Handler.registerHandler);
router.post("/login", validate(Validation.loginSchema), Handler.loginHandler);
router.post("/v2/login", validate(Validation.loginSchemaV2), Handler.loginHandler);
router.post("/verify-token", validate(Validation.verifyTokenSchema), cacheMiddleware(300), Handler.verifyTokenHandler);
router.post("/verify-user-token", validate(Validation.verifyTokenSchema), cacheMiddleware(300), Handler.verifyTokenHandler);
router.post("/verify-admin-token", validate(Validation.verifyAdminTokenSchema), cacheMiddleware(300), Handler.verifyAdminTokenHandler);

export default router;