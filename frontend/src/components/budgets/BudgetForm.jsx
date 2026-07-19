import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

// We want to limit budgets primarily to Expense categories
const EXPENSE_CATEGORIES = ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];

export const BudgetForm = ({ defaultValues, onSubmit, isSubmitting }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: defaultValues || {
            period: 'monthly'
        }
    });

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                    className={cn(
                        "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent",
                        errors.category && "border-red-500 focus:ring-red-500"
                    )}
                    {...register('category', { required: 'Category is required' })}
                    disabled={!!defaultValues} // Cannot change category when editing an existing budget
                >
                    <option value="">Select a category to budget for...</option>
                    {EXPENSE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                {defaultValues && <p className="mt-1 text-xs text-slate-500">You cannot change the category of an existing budget.</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Limit Amount</label>
                <Input
                    type="number"
                    step="0.01"
                    placeholder="E.g., 500.00"
                    {...register('amount', { 
                        required: 'Amount is required',
                        valueAsNumber: true,
                        min: { value: 1, message: 'Must be greater than 0' }
                    })}
                    error={errors.amount?.message}
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button type="submit" isLoading={isSubmitting}>
                    {defaultValues ? 'Update Budget' : 'Save Budget'}
                </Button>
            </div>
        </form>
    );
};
