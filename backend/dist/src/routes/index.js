"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidRoutes = exports.gigRoutes = exports.categoryRoutes = exports.userRoutes = exports.authRoutes = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
var users_1 = require("./users");
Object.defineProperty(exports, "userRoutes", { enumerable: true, get: function () { return __importDefault(users_1).default; } });
var categories_1 = require("./categories");
Object.defineProperty(exports, "categoryRoutes", { enumerable: true, get: function () { return __importDefault(categories_1).default; } });
var gigs_1 = require("./gigs");
Object.defineProperty(exports, "gigRoutes", { enumerable: true, get: function () { return __importDefault(gigs_1).default; } });
var bids_1 = require("./bids");
Object.defineProperty(exports, "bidRoutes", { enumerable: true, get: function () { return __importDefault(bids_1).default; } });
//# sourceMappingURL=index.js.map