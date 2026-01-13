"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gigController_1 = require("../controllers/gigController");
const middleware_1 = require("../middleware");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
// GET /api/gigs - List all open gigs (with pagination & search)
router.get('/', (0, middleware_1.validateQuery)(schemas_1.gigQuerySchema), (0, middleware_1.asyncHandler)(gigController_1.getGigs));
// GET /api/gigs/my - Get current user's gigs (Protected)
router.get('/my', middleware_1.authMiddleware, (0, middleware_1.asyncHandler)(gigController_1.getMyGigs));
// GET /api/gigs/:id - Get single gig
router.get('/:id', (0, middleware_1.asyncHandler)(gigController_1.getGig));
// POST /api/gigs - Create new gig (Protected)
router.post('/', middleware_1.authMiddleware, (0, middleware_1.validate)(schemas_1.createGigSchema), (0, middleware_1.asyncHandler)(gigController_1.createGig));
exports.default = router;
//# sourceMappingURL=gigs.js.map