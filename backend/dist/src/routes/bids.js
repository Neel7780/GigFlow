"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bidController_1 = require("../controllers/bidController");
const middleware_1 = require("../middleware");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
// POST /api/bids - Submit a bid (Protected)
router.post('/', middleware_1.authMiddleware, (0, middleware_1.validate)(schemas_1.createBidSchema), (0, middleware_1.asyncHandler)(bidController_1.createBid));
// GET /api/bids/my - Get user's submitted bids (Protected)
router.get('/my', middleware_1.authMiddleware, (0, middleware_1.asyncHandler)(bidController_1.getMyBids));
// GET /api/bids/:gigId - Get all bids for a gig (Owner only)
router.get('/:gigId', middleware_1.authMiddleware, (0, middleware_1.asyncHandler)(bidController_1.getBidsForGig));
// PATCH /api/bids/:bidId/hire - Hire a freelancer (Owner only)
router.patch('/:bidId/hire', middleware_1.authMiddleware, (0, middleware_1.asyncHandler)(bidController_1.hireBid));
exports.default = router;
//# sourceMappingURL=bids.js.map