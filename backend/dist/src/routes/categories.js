"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const middleware_1 = require("../middleware");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
// GET /api/categories
router.get('/', (0, middleware_1.asyncHandler)(categoryController_1.getCategories));
// GET /api/categories/:id
router.get('/:id', (0, middleware_1.asyncHandler)(categoryController_1.getCategory));
// POST /api/categories (Protected)
router.post('/', middleware_1.authMiddleware, (0, middleware_1.validate)(schemas_1.createCategorySchema), (0, middleware_1.asyncHandler)(categoryController_1.createCategory));
exports.default = router;
//# sourceMappingURL=categories.js.map