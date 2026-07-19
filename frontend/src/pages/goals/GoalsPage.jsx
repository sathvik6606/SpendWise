import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Target, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import { Modal } from '../../components/ui/Modal';
import { GoalForm } from '../../components/goals/GoalForm';
import { ContributionForm } from '../../components/goals/ContributionForm';
import { cn } from '../../lib/utils';

import { useCurrency } from '../../hooks/useCurrency';
const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
};

const GoalsPage = () => {
    const { formatCurrency } = useCurrency();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal States
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    
    const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
    const [activeGoalForContribution, setActiveGoalForContribution] = useState(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const res = await axios.get('/api/goals');
            setGoals(res.data);
        } catch (error) {
            toast.error('Failed to fetch goals');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingGoal(null);
        setIsGoalModalOpen(true);
    };

    const handleOpenEditModal = (goal) => {
        setEditingGoal(goal);
        setIsGoalModalOpen(true);
    };

    const handleOpenContributeModal = (goal) => {
        setActiveGoalForContribution(goal);
        setIsContributeModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) return;
        
        try {
            await axios.delete(`/api/goals/${id}`);
            toast.success('Goal deleted');
            setGoals(goals.filter(g => g._id !== id));
        } catch (error) {
            toast.error('Failed to delete goal');
        }
    };

    const onSubmitGoalForm = async (data) => {
        setIsSubmitting(true);
        try {
            if (editingGoal) {
                const res = await axios.put(`/api/goals/${editingGoal._id}`, data);
                toast.success('Goal updated');
                setGoals(goals.map(g => g._id === editingGoal._id ? res.data : g));
            } else {
                const res = await axios.post('/api/goals', data);
                toast.success('Goal created');
                setGoals([...goals, res.data]);
            }
            setIsGoalModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmitContribution = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await axios.post(`/api/goals/${activeGoalForContribution._id}/contribute`, data);
            toast.success('Contribution added successfully!');
            setGoals(goals.map(g => g._id === activeGoalForContribution._id ? res.data : g));
            setIsContributeModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add contribution');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Savings Goals</h2>
                    <p className="text-sm text-slate-500 mt-1">Set financial targets and track your progress over time.</p>
                </div>
                <Button onClick={handleOpenAddModal} className="shrink-0">
                    <Plus className="mr-2 h-4 w-4" /> Create Goal
                </Button>
            </div>

            {/* Goals Grid */}
            {loading ? (
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="h-48 bg-slate-50" />
                        </Card>
                    ))}
                </div>
            ) : goals.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="mx-auto h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                        <Target className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No active goals</h3>
                    <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                        Whether it's a new car, a vacation, or an emergency fund, setting goals helps you save faster.
                    </p>
                    <Button onClick={handleOpenAddModal} className="mt-6">
                        Set your first goal
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {goals.map((goal) => {
                        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                        const isCompleted = goal.status === 'completed';

                        return (
                            <Card key={goal._id} className={cn("relative overflow-hidden transition-all hover:shadow-md", isCompleted && "border-green-200 bg-green-50/30")}>
                                {/* Top color strip */}
                                <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: goal.color }} />
                                
                                <CardHeader className="flex flex-row items-start justify-between pb-2 pt-5">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1">{goal.title}</CardTitle>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Target: {formatDate(goal.deadline)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-sm border border-slate-100">
                                        <button 
                                            onClick={() => handleOpenEditModal(goal)}
                                            className="text-slate-400 hover:text-slate-900 transition-colors p-1.5"
                                            title="Edit Goal"
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(goal._id)}
                                            className="text-slate-400 hover:text-red-600 transition-colors p-1.5"
                                            title="Delete Goal"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mt-2 mb-4">
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-3xl font-bold text-slate-900 tracking-tight">
                                                {formatCurrency(goal.currentAmount)}
                                            </span>
                                            <span className="text-sm font-medium text-slate-500">
                                                / {formatCurrency(goal.targetAmount)}
                                            </span>
                                        </div>
                                        
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div>
                                                    <span className={cn(
                                                        "text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full",
                                                        isCompleted ? "text-green-600 bg-green-200" : "text-teal-600 bg-teal-100"
                                                    )}>
                                                        {isCompleted ? 'Goal Reached' : 'In Progress'}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-semibold inline-block text-slate-600">
                                                        {progress.toFixed(0)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <Progress 
                                                value={goal.currentAmount} 
                                                max={goal.targetAmount} 
                                                className="h-2.5"
                                            />
                                        </div>
                                    </div>

                                    {!isCompleted && (
                                        <Button 
                                            variant="outline" 
                                            className="w-full mt-2 bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                                            onClick={() => handleOpenContributeModal(goal)}
                                        >
                                            <PlusCircle className="mr-2 h-4 w-4 text-teal-600" /> 
                                            Add Funds
                                        </Button>
                                    )}
                                    {isCompleted && (
                                        <div className="w-full mt-2 py-2 flex items-center justify-center text-sm font-medium text-green-700 bg-green-100 rounded-md">
                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Goal Completed
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Goal Form Modal */}
            <Modal 
                isOpen={isGoalModalOpen} 
                onClose={() => setIsGoalModalOpen(false)}
                title={editingGoal ? 'Edit Goal' : 'Create Savings Goal'}
            >
                <GoalForm 
                    defaultValues={editingGoal}
                    onSubmit={onSubmitGoalForm}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            {/* Contribute Modal */}
            <Modal 
                isOpen={isContributeModalOpen} 
                onClose={() => setIsContributeModalOpen(false)}
                title="Add Contribution"
            >
                {activeGoalForContribution && (
                    <ContributionForm 
                        goal={activeGoalForContribution}
                        onSubmit={onSubmitContribution}
                        isSubmitting={isSubmitting}
                    />
                )}
            </Modal>
        </div>
    );
};

export default GoalsPage;
