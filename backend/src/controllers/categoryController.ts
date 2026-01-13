import { Request, Response } from 'express';
import { Category } from '../../db/models';
import { CreateCategoryInput } from '../validators/schemas';

export async function getCategories(_req: Request, res: Response): Promise<void> {
    const categories = await Category.find().sort({ name: 1 });

    res.json({ categories });
}

export async function createCategory(req: Request, res: Response): Promise<void> {
    const { name, description } = req.body as CreateCategoryInput;

    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
        res.status(409).json({ error: 'Category already exists' });
        return;
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
        message: 'Category created successfully',
        category,
    });
}

export async function getCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }

    res.json({ category });
}
