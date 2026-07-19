import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Search, Edit2, Trash2, Eye, Download, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { TransactionForm } from '../../components/transactions/TransactionForm';

import { useCurrency } from '../../hooks/useCurrency';
const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
};

const TransactionsPage = () => {
    const { formatCurrency } = useCurrency();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [importPreview, setImportPreview] = useState([]);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('/api/transactions');
            setTransactions(res.data);
        } catch (error) {
            toast.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        
        try {
            await axios.delete(`/api/transactions/${id}`);
            toast.success('Transaction deleted');
            setTransactions(transactions.filter(t => t._id !== id));
        } catch (error) {
            toast.error('Failed to delete transaction');
        }
    };

    const onSubmitForm = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                tags: data.tags ? data.tags.split(',').map((item) => item.trim()).filter(Boolean) : [],
            };
            if (editingTransaction) {
                const res = await axios.put(`/api/transactions/${editingTransaction._id}`, payload);
                toast.success('Transaction updated');
                setTransactions(transactions.map(t => t._id === editingTransaction._id ? res.data : t));
            } else {
                const res = await axios.post('/api/transactions', payload);
                toast.success('Transaction added');
                setTransactions([res.data, ...transactions]);
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExportCsv = () => {
        const rows = filteredTransactions.map((tx) => [tx.title, tx.category, tx.type, tx.amount, tx.paymentMethod, tx.date].join(','));
        const csv = ['title,category,type,amount,paymentMethod,date', ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'transactions.csv';
        link.click();
        window.URL.revokeObjectURL(url);
        toast.success('Exported transactions to CSV');
    };

    const handleImportCsv = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        const rows = text.split(/\r?\n/).filter(Boolean).slice(1);
        const preview = rows.slice(0, 4).map((row) => row.split(','));
        setImportPreview(preview);
        toast.success('Import preview ready');
    };

    const filteredTransactions = transactions.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search transactions..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                        <Upload className="mr-2 h-4 w-4" /> Import CSV
                        <input type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
                    </label>
                    <Button onClick={handleExportCsv} variant="secondary">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button onClick={handleOpenAddModal} className="shrink-0">
                        <Plus className="mr-2 h-4 w-4" /> Add Transaction
                    </Button>
                </div>
            </div>

            {importPreview.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Import preview</p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {importPreview.map((row, index) => (
                            <div key={index} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                {row.join(' • ')}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-700"></div></div>
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            {formatDate(tx.date)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => setSelectedTransaction(tx)} className="text-left">
                                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{tx.title}</div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">{tx.paymentMethod}</div>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant="default">{tx.category}</Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                            <span className={tx.type === 'income' ? 'text-green-600' : 'text-slate-900 dark:text-slate-100'}>
                                                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedTransaction(tx)}
                                                    className="text-slate-400 hover:text-teal-600 transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenEditModal(tx)}
                                                    className="text-slate-400 hover:text-teal-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(tx._id)}
                                                    className="text-slate-400 hover:text-red-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            >
                <TransactionForm 
                    defaultValues={editingTransaction}
                    onSubmit={onSubmitForm}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <div className={`fixed inset-y-0 right-0 z-[60] w-full max-w-md border-l border-slate-200 bg-white shadow-2xl transition-transform dark:border-slate-700 dark:bg-slate-900 ${selectedTransaction ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Transaction details</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{selectedTransaction?.title}</p>
                    </div>
                    <button onClick={() => setSelectedTransaction(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
                </div>
                {selectedTransaction ? (
                    <div className="space-y-4 overflow-y-auto p-6">
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Receipt</p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedTransaction?.receiptUrl || 'No receipt attached'}</p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Merchant</p>
                                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{selectedTransaction?.merchant || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Category</p>
                                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{selectedTransaction?.category}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Payment method</p>
                                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{selectedTransaction?.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tags</p>
                                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{selectedTransaction?.tags?.length ? selectedTransaction.tags.join(', ') : '—'}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Notes</p>
                            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{selectedTransaction?.notes || 'No notes'}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">History</p>
                            <div className="mt-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                Created {new Date(selectedTransaction?.createdAt).toLocaleDateString()} • Updated {new Date(selectedTransaction?.updatedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default TransactionsPage;
