import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        type: {
            type: String,
            required: [true, 'Please specify transaction type (income or expense)'],
            enum: ['income', 'expense'],
        },
        amount: {
            type: Number,
            required: [true, 'Please add an amount'],
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please specify a category'],
        },
        date: {
            type: Date,
            required: [true, 'Please specify a date'],
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            default: 'Cash',
        },
        notes: {
            type: String,
            default: '',
        },
        receiptUrl: {
            type: String,
            default: '', // For Cloudinary URL later
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        recurrenceFrequency: {
            type: String,
            default: 'monthly',
        },
        nextOccurrence: {
            type: Date,
            default: null,
        },
        merchant: {
            type: String,
            default: '',
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
