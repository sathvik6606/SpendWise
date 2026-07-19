import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, TrendingDown, TrendingUp, Target, Activity, DollarSign, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useCurrency } from '../../hooks/useCurrency';

const InsightsPage = () => {
  const { formatCurrency } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/transactions');
        setTransactions(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const insights = useMemo(() => {
    if (!transactions.length) return [];

    const expenses = transactions.filter((item) => item.type === 'expense');
    const incomes  = transactions.filter((item) => item.type === 'income');

    const now           = new Date();
    const monthStart    = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd  = new Date(now.getFullYear(), now.getMonth(), 0);

    const monthExpenses     = expenses.filter((item) => new Date(item.date) >= monthStart);
    const lastMonthExpenses = expenses.filter((item) => {
      const d = new Date(item.date);
      return d >= lastMonthStart && d <= lastMonthEnd;
    });

    const thisMonthTotal = monthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

    const totalIncome  = incomes.reduce((sum, item)  => sum + Number(item.amount), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    const result = [];

    // 1. Month-over-month spending trend (only show if last month had data)
    if (lastMonthTotal > 0) {
      const changePct = (((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(0);
      const direction = changePct < 0 ? 'less' : 'more';
      result.push({
        icon: changePct < 0 ? TrendingDown : TrendingUp,
        title: 'Monthly spending trend',
        value: `You spent ${Math.abs(changePct)}% ${direction} this month compared to last month.`,
        good: Number(changePct) <= 0,
      });
    } else if (thisMonthTotal > 0) {
      result.push({
        icon: Activity,
        title: 'Monthly spending trend',
        value: 'This is your first month of recorded data. Keep tracking to see trends.',
        good: null,
      });
    }

    // 2. Top spending category
    if (expenses.length > 0) {
      const categoryTotals = {};
      expenses.forEach((item) => {
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + Number(item.amount);
      });
      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      const pct = totalExpense > 0 ? ((topCategory[1] / totalExpense) * 100).toFixed(0) : 0;
      result.push({
        icon: Target,
        title: 'Top spending category',
        value: `${topCategory[0]} accounts for ${pct}% of your total expenses (${formatCurrency(topCategory[1])}).`,
        good: null,
      });
    }

    // 3. Savings rate (only if there is income)
    if (totalIncome > 0) {
      const savingsRate = (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(0);
      const good = Number(savingsRate) >= 20;
      result.push({
        icon: DollarSign,
        title: 'Savings rate',
        value: `You have saved ${savingsRate}% of your total income${good ? ' — great work!' : '. Aim for at least 20%.'}`,
        good,
      });
    }

    // 4. Largest single transaction
    if (transactions.length > 0) {
      const largest = transactions.reduce((acc, item) =>
        Number(item.amount) > Number(acc.amount) ? item : acc
      );
      result.push({
        icon: AlertCircle,
        title: 'Largest transaction',
        value: `Your largest recorded transaction is ${formatCurrency(largest.amount)} — "${largest.title}" (${largest.type}).`,
        good: null,
      });
    }

    // 5. Average daily spend this month (only if there are expenses this month)
    if (monthExpenses.length > 0) {
      const daysElapsed = Math.max(1, now.getDate());
      const avgDaily = thisMonthTotal / daysElapsed;
      result.push({
        icon: Activity,
        title: 'Average daily spend',
        value: `You are spending an average of ${formatCurrency(avgDaily)} per day this month.`,
        good: null,
      });
    }

    return result;
  }, [transactions, formatCurrency]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {insights.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {insights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        item.good === true  ? 'bg-green-100 dark:bg-green-900/40' :
                        item.good === false ? 'bg-amber-100 dark:bg-amber-900/40' :
                                             'bg-slate-100 dark:bg-slate-700'
                      }`}>
                        <Icon className={`h-3.5 w-3.5 ${
                          item.good === true  ? 'text-green-600 dark:text-green-400' :
                          item.good === false ? 'text-amber-600 dark:text-amber-400' :
                                               'text-slate-500 dark:text-slate-400'
                        }`} />
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.value}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                <Lightbulb className="h-7 w-7 text-slate-400" />
              </div>
              <div className="text-center max-w-xs">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No insights available yet</p>
                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                  Add a few income and expense transactions and your personalised financial insights will appear here.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsPage;
