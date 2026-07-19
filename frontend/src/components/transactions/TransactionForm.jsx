import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

const EXPENSE_CATEGORIES = ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'];

export const TransactionForm = ({ defaultValues, onSubmit, isSubmitting }) => {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: defaultValues || {
            type: 'expense',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'Card',
            isRecurring: false,
            recurrenceFrequency: 'monthly',
            merchant: '',
            tags: ''
        }
    });

    const selectedType = watch('type');
    const categories = selectedType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    useEffect(() => {
        if (defaultValues) {
            // Format date for date input (YYYY-MM-DD)
            const formattedValues = {
                ...defaultValues,
                date: new Date(defaultValues.date).toISOString().split('T')[0]
            };
            reset(formattedValues);
        }
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Type Selector (Radio Pills) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                <label className={cn(
                    "cursor-pointer text-center py-2 rounded-md text-sm font-medium transition-colors",
                    selectedType === 'expense' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}>
                    <input type="radio" value="expense" className="sr-only" {...register('type')} />
                    Expense
                </label>
                <label className={cn(
                    "cursor-pointer text-center py-2 rounded-md text-sm font-medium transition-colors",
                    selectedType === 'income' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}>
                    <input type="radio" value="income" className="sr-only" {...register('type')} />
                    Income
                </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register('amount', { 
                            required: 'Amount is required',
                            valueAsNumber: true,
                            min: { value: 0.01, message: 'Must be positive' }
                        })}
                        error={errors.amount?.message}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <Input
                        type="date"
                        {...register('date', { required: 'Date is required' })}
                        error={errors.date?.message}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <Input
                    type="text"
                    placeholder="E.g., Groceries, Rent, Salary..."
                    {...register('title', { required: 'Title is required' })}
                    error={errors.title?.message}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Merchant</label>
                    <Input type="text" placeholder="Amazon, Employer..." {...register('merchant')} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                    <Input type="text" placeholder="home, travel" {...register('tags')} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                        className={cn(
                            "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent",
                            errors.category && "border-red-500 focus:ring-red-500"
                        )}
                        {...register('category', { required: 'Category is required' })}
                    >
                        <option value="">Select...</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                        {...register('paymentMethod')}
                    >
                        <option value="Card">Card</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" {...register('isRecurring')} />
                    Recurring transaction
                </label>
                {selectedType === 'expense' ? (
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm text-slate-600">Frequency</label>
                            <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" {...register('recurrenceFrequency')}>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm text-slate-600">Next occurrence</label>
                            <Input type="date" {...register('nextOccurrence')} />
                        </div>
                    </div>
                ) : null}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <textarea
                    className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent min-h-[80px]"
                    placeholder="Add any extra details..."
                    {...register('notes')}
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button type="submit" isLoading={isSubmitting}>
                    {defaultValues ? 'Update Transaction' : 'Save Transaction'}
                </Button>
            </div>
        </form>
    );
};
