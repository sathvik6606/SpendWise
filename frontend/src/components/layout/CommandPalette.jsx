import React, { useEffect, useMemo, useState } from 'react';
import { Search, ArrowUpRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const [transactionsRes, budgetsRes, goalsRes] = await Promise.all([
          axios.get('/api/transactions'),
          axios.get('/api/budgets'),
          axios.get('/api/goals'),
        ]);

        const items = [
          ...transactionsRes.data.map((item) => ({ ...item, type: 'transaction', label: item.title, detail: item.category })),
          ...budgetsRes.data.map((item) => ({ ...item, type: 'budget', label: item.category, detail: `Budget • ${item.amount}` })),
          ...goalsRes.data.map((item) => ({ ...item, type: 'goal', label: item.title, detail: `Goal • ${item.targetAmount}` })),
        ].filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(query.toLowerCase()));

        setResults(items.slice(0, 8));
      } catch {
        setResults([]);
      }
    };

    const timeout = setTimeout(fetchResults, 150);
    return () => clearTimeout(timeout);
  }, [isOpen, query]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
      } else if (event.key === 'Enter' && results[selectedIndex]) {
        event.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSelect = (item) => {
    onClose();
    if (item.type === 'transaction') navigate('/transactions');
    if (item.type === 'budget') navigate('/budgets');
    if (item.type === 'goal') navigate('/goals');
  };

  const recentItems = useMemo(() => {
    return [
      { label: 'Dashboard', detail: 'Overview', route: '/dashboard' },
      { label: 'Transactions', detail: 'Recent movements', route: '/transactions' },
      { label: 'Budgets', detail: 'Category limits', route: '/budgets' },
      { label: 'Insights', detail: 'Monthly analysis', route: '/analytics' },
    ];
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/20 px-4 py-20 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search transactions, budgets, goals, categories..."
            className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none dark:text-slate-200"
          />
          <div className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            ⌘K
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="space-y-1">
              {recentItems.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => { onClose(); navigate(item.route); }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/70">
              <Sparkles className="h-8 w-8 text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">No results for “{query}”</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try another keyword or navigate to a page directly.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, index) => (
                <button
                  key={`${item.type}-${item._id || item.label}-${index}`}
                  onClick={() => handleSelect(item)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors ${selectedIndex === index ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</div>
                  </div>
                  <div className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {item.type}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {user?.name ? `Search as ${user.name}` : 'Search your financial workspace'}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
