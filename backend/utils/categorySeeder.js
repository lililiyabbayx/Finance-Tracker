const { Category } = require('../model/Entry');

const DEFAULT_CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Education',
    'Savings',
    'Income',
    'Other'
];

async function seedCategoriesForUser(userId) {
    try {
        const existingCategories = await Category.find({ userId });
        
        // Only seed if user has no categories
        if (existingCategories.length === 0) {
            const categoryPromises = DEFAULT_CATEGORIES.map(name => {
                const category = new Category({
                    name,
                    userId
                });
                return category.save();
            });

            await Promise.all(categoryPromises);
            console.log(`Default categories created for user: ${userId}`);
        }
    } catch (error) {
        console.error('Error seeding categories:', error);
        throw error;
    }
}

module.exports = {
    seedCategoriesForUser,
    DEFAULT_CATEGORIES
};
