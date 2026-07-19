import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a goal title'],
            trim: true,
        },
        targetAmount: {
            type: Number,
            required: [true, 'Please add a target amount'],
        },
        currentAmount: {
            type: Number,
            default: 0,
        },
        deadline: {
            type: Date,
            required: [true, 'Please add a target date'],
        },
        color: {
            type: String,
            default: '#0F766E', // Default teal-700
        },
        status: {
            type: String,
            enum: ['active', 'completed'],
            default: 'active',
        }
    },
    {
        timestamps: true,
    }
);

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
