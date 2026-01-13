"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const middleware_1 = require("../middleware");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
// POST /api/auth/register
router.post('/register', (0, middleware_1.validate)(schemas_1.registerSchema), (0, middleware_1.asyncHandler)(authController_1.register));
// POST /api/auth/login
router.post('/login', (0, middleware_1.validate)(schemas_1.loginSchema), (0, middleware_1.asyncHandler)(authController_1.login));
// POST /api/auth/logout
router.post('/logout', middleware_1.authMiddleware, (0, middleware_1.asyncHandler)(authController_1.logout));
// GET /api/auth/me
router.get('/me', middleware_1.authMiddleware, (0, middleware_1.asyncHandler)(authController_1.me));
exports.default = router;
//# sourceMappingURL=auth.js.map