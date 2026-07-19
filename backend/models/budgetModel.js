import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        category: {
            type: String,
            required: [true, 'Please specify a category'],
        },
        amount: {
            type: Number,
            required: [true, 'Please add a budget amount'],
        },
        period: {
            type: String,
            default: 'monthly', // monthly, weekly, yearly
        },
    },
    {
        timestamps: true,
    }
);

// Ensure a user can only have one budget per category
budgetSchema.index({ user: 1, category: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
