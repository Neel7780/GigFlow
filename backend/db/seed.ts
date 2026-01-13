import { Category } from './models';
import { connectDB } from './db';

const seedCategories = [
    { name: 'Development', description: 'Web, mobile, and software development' },
    { name: 'Design', description: 'UI/UX, graphic design, and branding' },
    { name: 'Writing & Content', description: 'Copywriting, content creation, and editing' },
    { name: 'Marketing', description: 'Digital marketing, SEO, and social media' },
    { name: 'Video & Animation', description: 'Video editing, motion graphics, and animation' },
    { name: 'Data & Analytics', description: 'Data science, analysis, and visualization' },
    { name: 'Consulting', description: 'Business consulting and advisory services' },
    { name: 'Other', description: 'Other freelance services' },
];

async function seed() {
    try {
        await connectDB();
        console.log('Connected to database');

        // Check existing categories
        const existing = await Category.countDocuments();
        if (existing > 0) {
            console.log(`Found ${existing} existing categories, skipping seed`);
            process.exit(0);
        }

        // Insert seed categories
        const result = await Category.insertMany(seedCategories);
        console.log(`Successfully seeded ${result.length} categories:`);
        result.forEach(cat => console.log(`  - ${cat.name} (${cat._id})`));

        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();
