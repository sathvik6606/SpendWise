import Budget from '../models/budgetModel.js';
import Transaction from '../models/transactionModel.js';

// @desc    Get user budgets with spent amounts
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id }).lean();
        
        // Calculate spent amount for each budget in the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const budgetsWithSpent = await Promise.all(
            budgets.map(async (budget) => {
                const transactions = await Transaction.aggregate([
                    {
                        $match: {
                            user: req.user._id,
                            type: 'expense',
                            category: budget.category,
                            date: { $gte: startOfMonth, $lte: endOfMonth }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalSpent: { $sum: '$amount' }
                        }
                    }
                ]);

                const spent = transactions.length > 0 ? transactions[0].totalSpent : 0;
                
                return {
                    ...budget,
                    spent,
                    progress: Math.min((spent / budget.amount) * 100, 100) // Cap at 100% for progress bar
                };
            })
        );

        res.json(budgetsWithSpent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a budget
// @route   POST /api/budgets
// @access  Private
export const addBudget = async (req, res) => {
    try {
        const { category, amount, period } = req.body;

        if (!category || !amount) {
            return res.status(400).json({ message: 'Please provide category and amount' });
        }

        const budgetExists = await Budget.findOne({ user: req.user.id, category });
        if (budgetExists) {
            return res.status(400).json({ message: 'A budget for this category already exists' });
        }

        const budget = await Budget.create({
            user: req.user.id,
            category,
            amount,
            period: period || 'monthly'
        });

        // Return with spent = 0 immediately since it's new
        res.status(201).json({ ...budget.toObject(), spent: 0, progress: 0 });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A budget for this category already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedBudget = await Budget.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        // We need to fetch the spent amount again to return the full object
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const transactions = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type: 'expense',
                    category: updatedBudget.category,
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: '$amount' }
                }
            }
        ]);

        const spent = transactions.length > 0 ? transactions[0].totalSpent : 0;

        res.json({
            ...updatedBudget.toObject(),
            spent,
            progress: Math.min((spent / updatedBudget.amount) * 100, 100)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await budget.deleteOne();
        res.json({ id: req.params.id, message: 'Budget deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
