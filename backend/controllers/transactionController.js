import Transaction from '../models/transactionModel.js';

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a transaction
// @route   POST /api/transactions
// @access  Private
export const addTransaction = async (req, res) => {
    try {
        const { type, amount, title, category, date, paymentMethod, notes, receiptUrl, isRecurring, recurrenceFrequency, nextOccurrence, merchant, tags } = req.body;

        if (!type || !amount || !title || !category || !date) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const transaction = await Transaction.create({
            user: req.user.id,
            type,
            amount,
            title,
            category,
            date,
            paymentMethod,
            notes,
            receiptUrl,
            isRecurring: Boolean(isRecurring),
            recurrenceFrequency: recurrenceFrequency || 'monthly',
            nextOccurrence: nextOccurrence || null,
            merchant: merchant || '',
            tags: tags || [],
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Check for user
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Check for user
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await transaction.deleteOne();
        res.json({ id: req.params.id, message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
