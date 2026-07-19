import Transaction from '../models/transactionModel.js';
import Bill from '../models/billModel.js';

// @desc    Get dashboard summary metrics (real data)
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();

        // Current month boundaries
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfThisMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // Last month boundaries
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        // 1. All-time income & expenses
        const totalsAgg = await Transaction.aggregate([
            { $match: { user: userId } },
            { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]);
        const totalIncome   = totalsAgg.find(t => t._id === 'income')?.total  || 0;
        const totalExpenses = totalsAgg.find(t => t._id === 'expense')?.total || 0;
        const currentBalance = totalIncome - totalExpenses;
        const totalSavings   = currentBalance > 0 ? currentBalance : 0;

        // 2. This-month totals
        const thisMonthAgg = await Transaction.aggregate([
            { $match: { user: userId, date: { $gte: startOfThisMonth, $lte: endOfThisMonth } } },
            { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]);
        const thisMonthIncome   = thisMonthAgg.find(t => t._id === 'income')?.total  || 0;
        const thisMonthExpenses = thisMonthAgg.find(t => t._id === 'expense')?.total || 0;

        // 3. Last-month totals
        const lastMonthAgg = await Transaction.aggregate([
            { $match: { user: userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]);
        const lastMonthIncome   = lastMonthAgg.find(t => t._id === 'income')?.total  || 0;
        const lastMonthExpenses = lastMonthAgg.find(t => t._id === 'expense')?.total || 0;

        // 4. Calculate real month-over-month percentage changes (null = no previous data)
        const calcChange = (current, previous) => {
            if (previous === 0) return null;          // no previous data
            return +((( current - previous ) / previous) * 100).toFixed(1);
        };

        const lastMonthBalance = lastMonthIncome - lastMonthExpenses;
        const thisMonthBalance = thisMonthIncome - thisMonthExpenses;

        const balanceChange  = calcChange(thisMonthBalance,  lastMonthBalance);
        const incomeChange   = calcChange(thisMonthIncome,   lastMonthIncome);
        const expenseChange  = calcChange(thisMonthExpenses, lastMonthExpenses);
        const savingsRate    = totalIncome > 0
            ? +((( totalIncome - totalExpenses ) / totalIncome) * 100).toFixed(1)
            : null;

        // 5. Recent 5 transactions
        const recentTransactions = await Transaction.find({ user: userId })
            .sort({ date: -1 })
            .limit(5)
            .lean();

        // 6. This month's category breakdown (expenses only)
        const categoryBreakdown = await Transaction.aggregate([
            {
                $match: {
                    user: userId,
                    type: 'expense',
                    date: { $gte: startOfThisMonth, $lte: endOfThisMonth }
                }
            },
            { $group: { _id: '$category', value: { $sum: '$amount' } } },
            { $project: { _id: 0, name: '$_id', value: 1 } },
            { $sort: { value: -1 } }
        ]);

        // 7. Last 6 months monthly trend
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const monthlyTrendRaw = await Transaction.aggregate([
            { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year:  { $year: '$date' },
                        month: { $month: '$date' },
                        type:  '$type'
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Pivot monthly trend into a chart-friendly format
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const trendMap = {};
        monthlyTrendRaw.forEach(item => {
            const key = `${item._id.year}-${item._id.month}`;
            if (!trendMap[key]) {
                trendMap[key] = { name: monthNames[item._id.month - 1], income: 0, expense: 0 };
            }
            trendMap[key][item._id.type] = item.total;
        });
        const monthlyTrend = Object.values(trendMap);

        // 8. Upcoming bills (next 30 days, unpaid)
        const in30Days = new Date(now);
        in30Days.setDate(in30Days.getDate() + 30);
        const upcomingBills = await Bill.find({
            user: userId,
            paid: false,
            dueDate: { $gte: now, $lte: in30Days }
        })
            .sort({ dueDate: 1 })
            .limit(5)
            .lean();

        res.json({
            currentBalance,
            totalIncome,
            totalExpenses,
            totalSavings,
            // month-over-month changes (null means "no previous month data")
            balanceChange,
            incomeChange,
            expenseChange,
            savingsRate,
            hasLastMonthData: lastMonthIncome > 0 || lastMonthExpenses > 0,
            recentTransactions,
            categoryBreakdown,
            monthlyTrend,
            upcomingBills,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get full analytics data
// @route   GET /api/dashboard/analytics
// @access  Private
export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

        // Last 12 months monthly trend
        const monthlyTrendRaw = await Transaction.aggregate([
            { $match: { user: userId, date: { $gte: twelveMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year:  { $year: '$date' },
                        month: { $month: '$date' },
                        type:  '$type'
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const trendMap = {};
        monthlyTrendRaw.forEach(item => {
            const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
            if (!trendMap[key]) {
                trendMap[key] = {
                    name: `${monthNames[item._id.month - 1]} '${String(item._id.year).slice(2)}`,
                    income: 0,
                    expense: 0
                };
            }
            trendMap[key][item._id.type] = item.total;
        });
        const monthlyTrend = Object.values(trendMap);

        // All-time category breakdown for expenses
        const categoryBreakdown = await Transaction.aggregate([
            { $match: { user: userId, type: 'expense' } },
            { $group: { _id: '$category', value: { $sum: '$amount' } } },
            { $project: { _id: 0, name: '$_id', value: 1 } },
            { $sort: { value: -1 } },
            { $limit: 10 }
        ]);

        // All-time income category breakdown
        const incomeBreakdown = await Transaction.aggregate([
            { $match: { user: userId, type: 'income' } },
            { $group: { _id: '$category', value: { $sum: '$amount' } } },
            { $project: { _id: 0, name: '$_id', value: 1 } },
            { $sort: { value: -1 } }
        ]);

        // Totals
        const totalsAgg = await Transaction.aggregate([
            { $match: { user: userId } },
            { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]);
        const totalIncome   = totalsAgg.find(t => t._id === 'income')?.total  || 0;
        const totalExpenses = totalsAgg.find(t => t._id === 'expense')?.total || 0;

        res.json({
            monthlyTrend,
            categoryBreakdown,
            incomeBreakdown,
            totalIncome,
            totalExpenses,
            savingsRate: totalIncome > 0
                ? +((( totalIncome - totalExpenses ) / totalIncome) * 100).toFixed(1)
                : null,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
