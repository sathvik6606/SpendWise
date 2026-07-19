import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import { Modal } from '../../components/ui/Modal';
import { BudgetForm } from '../../components/budgets/BudgetForm';
import { cn } from '../../lib/utils';

import { useCurrency } from '../../hooks/useCurrency';
const BudgetsPage = () => {
    const { formatCurrency } = useCurrency();
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const res = await axios.get('/api/budgets');
            setBudgets(res.data);
        } catch (error) {
            toast.error('Failed to fetch budgets');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingBudget(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this budget?')) return;
        
        try {
            await axios.delete(`/api/budgets/${id}`);
            toast.success('Budget deleted');
            setBudgets(budgets.filter(b => b._id !== id));
        } catch (error) {
            toast.error('Failed to delete budget');
        }
    };

    const onSubmitForm = async (data) => {
        setIsSubmitting(true);
        try {
            if (editingBudget) {
                const res = await axios.put(`/api/budgets/${editingBudget._id}`, data);
                toast.success('Budget updated');
                setBudgets(budgets.map(b => b._id === editingBudget._id ? res.data : b));
            } else {
                const res = await axios.post('/api/budgets', data);
                toast.success('Budget created');
                setBudgets([...budgets, res.data]);
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Monthly Budgets</h2>
                    <p className="text-sm text-slate-500 mt-1">Set limits on specific categories to keep your spending in check.</p>
                </div>
                <Button onClick={handleOpenAddModal} className="shrink-0">
                    <Plus className="mr-2 h-4 w-4" /> Create Budget
                </Button>
            </div>

            {/* Budgets Grid */}
            {loading ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="h-40 bg-slate-50" />
                        </Card>
                    ))}
                </div>
            ) : budgets.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-medium text-slate-900">No budgets created yet</h3>
                    <p className="mt-1 text-sm text-slate-500">Get started by creating a budget for your most common expenses.</p>
                    <Button onClick={handleOpenAddModal} className="mt-6" variant="outline">
                        Create your first budget
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {budgets.map((budget) => {
                        const isNearingLimit = budget.progress >= 80 && budget.progress < 100;
                        const isOverLimit = budget.progress >= 100;

                        return (
                            <Card key={budget._id}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-base font-semibold">{budget.category}</CardTitle>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => handleOpenEditModal(budget)}
                                            className="text-slate-400 hover:text-teal-600 transition-colors p-1"
                                            title="Edit Limit"
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(budget._id)}
                                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                                            title="Delete Budget"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end justify-between mb-2">
                                        <div>
                                            <span className={cn("text-2xl font-bold", isOverLimit ? "text-red-600" : "text-slate-900")}>
                                                {formatCurrency(budget.spent)}
                                            </span>
                                            <span className="text-sm text-slate-500 ml-1">
                                                / {formatCurrency(budget.amount)}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">
                                            {budget.progress.toFixed(0)}%
                                        </span>
                                    </div>
                                    
                                    <Progress 
                                        value={budget.spent} 
                                        max={budget.amount} 
                                        className="mt-3"
                                        indicatorClassName={
                                            isOverLimit ? "bg-red-500" : 
                                            isNearingLimit ? "bg-yellow-500" : "bg-teal-600"
                                        }
                                    />
                                    
                                    <div className="mt-3 h-5">
                                        {isOverLimit ? (
                                            <div className="flex items-center text-xs font-medium text-red-600">
                                                <AlertCircle className="h-3.5 w-3.5 mr-1" /> Over budget by {formatCurrency(budget.spent - budget.amount)}
                                            </div>
                                        ) : isNearingLimit ? (
                                            <div className="flex items-center text-xs font-medium text-yellow-600">
                                                <AlertCircle className="h-3.5 w-3.5 mr-1" /> Nearing budget limit
                                            </div>
                                        ) : (
                                            <div className="text-xs text-slate-500">
                                                {formatCurrency(budget.amount - budget.spent)} remaining
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={editingBudget ? 'Edit Budget' : 'Create Budget'}
            >
                <BudgetForm 
                    defaultValues={editingBudget}
                    onSubmit={onSubmitForm}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </div>
    );
};

export default BudgetsPage;
