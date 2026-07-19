import Goal from '../models/goalModel.js';

// @desc    Get user goals
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id }).sort({ deadline: 1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a goal
// @route   POST /api/goals
// @access  Private
export const addGoal = async (req, res) => {
    try {
        const { title, targetAmount, deadline, color } = req.body;

        if (!title || !targetAmount || !deadline) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const goal = await Goal.create({
            user: req.user.id,
            title,
            targetAmount,
            deadline,
            color,
            currentAmount: 0,
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedGoal = await Goal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        // Check completion status
        if (updatedGoal.currentAmount >= updatedGoal.targetAmount && updatedGoal.status !== 'completed') {
            updatedGoal.status = 'completed';
            await updatedGoal.save();
        } else if (updatedGoal.currentAmount < updatedGoal.targetAmount && updatedGoal.status === 'completed') {
            updatedGoal.status = 'active';
            await updatedGoal.save();
        }

        res.json(updatedGoal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add contribution to goal
// @route   POST /api/goals/:id/contribute
// @access  Private
export const addContribution = async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Please provide a valid contribution amount' });
        }

        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        goal.currentAmount += amount;
        
        if (goal.currentAmount >= goal.targetAmount) {
            goal.status = 'completed';
        }

        await goal.save();

        res.json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await goal.deleteOne();
        res.json({ id: req.params.id, message: 'Goal deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
