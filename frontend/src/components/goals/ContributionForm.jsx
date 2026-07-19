import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

import { useCurrency } from '../../hooks/useCurrency';

export const ContributionForm = ({ goal, onSubmit, isSubmitting }) => {
    const { formatCurrency } = useCurrency();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const remaining = goal.targetAmount - goal.currentAmount;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <p className="text-sm text-slate-600 mb-4">
                    Add funds to your <span className="font-semibold text-slate-900">{goal.title}</span> goal. 
                    You need <span className="font-semibold text-teal-600">{formatCurrency(remaining)}</span> more to reach your target!
                </p>
                
                <label className="block text-sm font-medium text-slate-700 mb-1">Contribution Amount</label>
                <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('amount', { 
                        required: 'Amount is required',
                        valueAsNumber: true,
                        min: { value: 0.01, message: 'Must be positive' },
                        max: { value: remaining, message: `Cannot exceed remaining amount of ${formatCurrency(remaining)}` }
                    })}
                    error={errors.amount?.message}
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button type="submit" isLoading={isSubmitting}>
                    Add Funds
                </Button>
            </div>
        </form>
    );
};
