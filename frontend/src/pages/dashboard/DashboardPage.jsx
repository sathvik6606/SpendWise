import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend, Cell, PieChart, Pie
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
    Wallet, TrendingUp, TrendingDown, PiggyBank,
    ArrowUpRight, ArrowDownRight, Minus,
    ReceiptText, BarChart2, Inbox
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { useCurrency } from '../../hooks/useCurrency';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Renders a change badge under a summary card value.
 * @param {number|null} change   – null means "no prior month data"
 * @param {boolean} invertColor  – true for Expenses card (down = good)
 */
const ChangeBadge = ({ change, invertColor = false }) => {
    if (change === null || change === undefined) {
        return (
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 italic">
                No previous month data
            </p>
        );
    }

    const positive = change >= 0;
    // For expenses: going up is red; going down is green. Invert accordingly.
    const isGood = invertColor ? !positive : positive;
    const Icon = positive ? ArrowUpRight : ArrowDownRight;

    return (
        <p className={cn('mt-1 flex items-center gap-1 text-xs font-medium',
            isGood ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
        )}>
            <Icon className="h-3 w-3" />
            {Math.abs(change)}% vs last month
        </p>
    );
};

// ── Empty state component for charts ─────────────────────────────────────────
const ChartEmptyState = ({ icon: Icon, title, subtitle }) => (
    <div className="flex h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
            <Icon className="h-6 w-6 text-slate-400" />
        </div>
        <div className="text-center">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
        </div>
    </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const DashboardPage = () => {
    const { formatCurrency } = useCurrency();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get('/api/dashboard/summary');
                setSummary(res.data);
            } catch (error) {
                console.error('Error fetching dashboard summary:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="h-24 bg-slate-100 dark:bg-slate-800 rounded-t-xl" />
                        <CardContent className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl" />
                    </Card>
                ))}
            </div>
        );
    }

    const monthlyTrendData  = summary?.monthlyTrend     || [];
    const categoryData      = summary?.categoryBreakdown || [];
    const recentTxs         = summary?.recentTransactions || [];
    const upcomingBills     = summary?.upcomingBills      || [];
    const hasNoTransactions = recentTxs.length === 0 && (summary?.totalIncome || 0) === 0;

    const COLORS = ['#0F766E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
        <div className="space-y-6">
            {/* ── Summary Cards ──────────────────────────────────────────────── */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Balance */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(summary?.currentBalance || 0)}
                        </div>
                        <ChangeBadge change={summary?.balanceChange ?? null} />
                    </CardContent>
                </Card>

                {/* Income */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Income</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(summary?.totalIncome || 0)}
                        </div>
                        <ChangeBadge change={summary?.incomeChange ?? null} />
                    </CardContent>
                </Card>

                {/* Expenses */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Expenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(summary?.totalExpenses || 0)}
                        </div>
                        <ChangeBadge change={summary?.expenseChange ?? null} invertColor />
                    </CardContent>
                </Card>

                {/* Savings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Savings</CardTitle>
                        <PiggyBank className="h-4 w-4 text-teal-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(summary?.totalSavings || 0)}
                        </div>
                        {summary?.savingsRate !== null && summary?.savingsRate !== undefined ? (
                            <p className="mt-1 text-xs text-teal-600 dark:text-teal-400 font-medium">
                                {summary.savingsRate}% of income saved
                            </p>
                        ) : (
                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 italic">
                                No income recorded yet
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Charts ─────────────────────────────────────────────────────── */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                {/* Cash Flow Trend */}
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Cash Flow Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-0">
                        {monthlyTrendData.length > 0 ? (
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#475569" />
                                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            labelStyle={{ color: '#f8fafc' }}
                                            itemStyle={{ color: '#f8fafc' }}
                                            formatter={(v) => [formatCurrency(v)]}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                        <Bar dataKey="income"  name="Income"  fill="#0F766E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                        <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <ChartEmptyState
                                icon={BarChart2}
                                title="No transaction history yet"
                                subtitle="Add income or expense transactions to see your cash flow trend."
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Expense Breakdown */}
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {categoryData.length > 0 ? (
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}
                                            itemStyle={{ color: '#f8fafc' }}
                                            formatter={(v) => [formatCurrency(v)]}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <ChartEmptyState
                                icon={ReceiptText}
                                title="No expenses this month"
                                subtitle="Expense categories will appear here once you log transactions."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Recent Activity ─────────────────────────────────────────────── */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentTxs.length > 0 ? (
                            <div className="space-y-4">
                                {recentTxs.map((tx, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{tx.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className={cn('text-sm font-semibold',
                                            tx.type === 'expense' ? 'text-slate-900 dark:text-slate-100' : 'text-green-600 dark:text-green-400'
                                        )}>
                                            {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <Inbox className="h-6 w-6 text-slate-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No transactions yet</p>
                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                        Head to Transactions to log your first income or expense.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Bills */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Bills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingBills.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingBills.map((bill, i) => {
                                    const due = new Date(bill.dueDate);
                                    const dayLabel = due.getDate();
                                    const monLabel = due.toLocaleDateString(undefined, { month: 'short' });
                                    return (
                                        <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
                                                    <span className="text-xs font-bold leading-none">{dayLabel}</span>
                                                    <span className="text-[10px] leading-none">{monLabel}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{bill.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{bill.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                {formatCurrency(bill.amount)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <ReceiptText className="h-6 w-6 text-slate-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No upcoming bills</p>
                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                        Bills due in the next 30 days will appear here.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
