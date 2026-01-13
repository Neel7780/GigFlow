"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const middleware_1 = require("../middleware");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
// GET /api/users/:id - Public profile
router.get('/:id', (0, middleware_1.asyncHandler)(userController_1.getProfile));
// PATCH /api/users/me - Update own profile
router.patch('/me', middleware_1.authMiddleware, (0, middleware_1.validate)(schemas_1.updateUserSchema), (0, middleware_1.asyncHandler)(userController_1.updateProfile));
exports.default = router;
//# sourceMappingURL=users.js.map