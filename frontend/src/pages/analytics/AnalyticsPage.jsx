import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { TrendingUp, TrendingDown, Percent, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';

import { useCurrency } from '../../hooks/useCurrency';
const COLORS = ['#0F766E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const CustomTooltip = ({ active, payload, label }) => {
    const { formatCurrency } = useCurrency();
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-lg text-sm">
                <p className="font-semibold text-slate-700 mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }}>
                        {p.name}: {formatCurrency(p.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const AnalyticsPage = () => {
    const { formatCurrency } = useCurrency();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('/api/dashboard/analytics');
                setAnalytics(res.data);
            } catch (error) {
                toast.error('Failed to load analytics data');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse h-72" />
                ))}
            </div>
        );
    }

    const noData = !analytics || (analytics.monthlyTrend.length === 0 && analytics.categoryBreakdown.length === 0);

    if (noData) {
        return (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                <div className="mx-auto h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No data to analyze yet</h3>
                <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                    Add some income and expense transactions to start seeing your financial analytics here.
                </p>
            </div>
        );
    }

    const { monthlyTrend, categoryBreakdown, incomeBreakdown, totalIncome, totalExpenses, savingsRate } = analytics;

    return (
        <div className="space-y-6">
            {/* Summary KPI Strip */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Income</p>
                                <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalIncome)}</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Expenses</p>
                                <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalExpenses)}</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-red-50 flex items-center justify-center">
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Net Savings</p>
                                <p className={cn("text-xl font-bold mt-1", (totalIncome - totalExpenses) >= 0 ? "text-teal-700" : "text-red-600")}>
                                    {formatCurrency(totalIncome - totalExpenses)}
                                </p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-teal-50 flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-teal-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Savings Rate</p>
                                <p className={cn("text-xl font-bold mt-1",
                                    savingsRate === null ? "text-slate-400" :
                                    parseFloat(savingsRate) >= 20 ? "text-teal-700" :
                                    parseFloat(savingsRate) > 0   ? "text-yellow-600" : "text-red-600"
                                )}>
                                    {savingsRate !== null ? `${savingsRate}%` : '—'}
                                </p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center">
                                <Percent className="h-4 w-4 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Income vs Expense — Line Chart */}
            {monthlyTrend.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Income vs Expenses — Last 12 Months</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
                                    <Line type="monotone" dataKey="income" name="Income" stroke="#0F766E" strokeWidth={2.5} dot={{ fill: '#0F766E', r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Bottom Row: Category Donut + Top Spend List */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">

                {/* Expense Category Donut */}
                {categoryBreakdown.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Expense Breakdown by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value">
                                            {categoryBreakdown.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Top Spending Categories Ranked */}
                {categoryBreakdown.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Spending Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 mt-2">
                                {categoryBreakdown.slice(0, 6).map((cat, index) => {
                                    const total = categoryBreakdown.reduce((sum, c) => sum + c.value, 0);
                                    const pct = total > 0 ? ((cat.value / total) * 100).toFixed(0) : 0;
                                    return (
                                        <div key={cat.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                    <span className="text-sm text-slate-700 font-medium">{cat.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-slate-500">{pct}%</span>
                                                    <span className="text-sm font-semibold text-slate-900 w-24 text-right">{formatCurrency(cat.value)}</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div
                                                    className="h-1.5 rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%`, backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Monthly Bar Chart */}
            {monthlyTrend.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Cash Flow</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
                                    <Bar dataKey="income" name="Income" fill="#0F766E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AnalyticsPage;
