"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = getCategories;
exports.createCategory = createCategory;
exports.getCategory = getCategory;
const models_1 = require("../../db/models");
// Get all categories
async function getCategories(_req, res) {
    const categories = await models_1.Category.find().sort({ name: 1 });
    res.json({ categories });
}
// Create a new category
async function createCategory(req, res) {
    const { name, description } = req.body;
    // Check if category exists
    const existing = await models_1.Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
        res.status(409).json({ error: 'Category already exists' });
        return;
    }
    const category = await models_1.Category.create({ name, description });
    res.status(201).json({
        message: 'Category created successfully',
        category,
    });
}
// Get single category
async function getCategory(req, res) {
    const { id } = req.params;
    const category = await models_1.Category.findById(id);
    if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }
    res.json({ category });
}
//# sourceMappingURL=categoryController.js.map