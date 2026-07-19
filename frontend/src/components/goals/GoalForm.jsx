import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const COLORS = [
    { name: 'Teal', value: '#0F766E', bgClass: 'bg-teal-700' },
    { name: 'Blue', value: '#3B82F6', bgClass: 'bg-blue-500' },
    { name: 'Purple', value: '#8B5CF6', bgClass: 'bg-purple-500' },
    { name: 'Amber', value: '#F59E0B', bgClass: 'bg-amber-500' },
    { name: 'Rose', value: '#F43F5E', bgClass: 'bg-rose-500' },
];

export const GoalForm = ({ defaultValues, onSubmit, isSubmitting }) => {
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
        defaultValues: defaultValues || {
            color: '#0F766E'
        }
    });

    const selectedColor = watch('color');

    useEffect(() => {
        if (defaultValues) {
            const formattedValues = {
                ...defaultValues,
                deadline: new Date(defaultValues.deadline).toISOString().split('T')[0]
            };
            reset(formattedValues);
        }
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Goal Title</label>
                <Input
                    type="text"
                    placeholder="E.g., Vacation to Japan, Emergency Fund..."
                    {...register('title', { required: 'Title is required' })}
                    error={errors.title?.message}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount</label>
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register('targetAmount', { 
                            required: 'Target amount is required',
                            valueAsNumber: true,
                            min: { value: 1, message: 'Must be positive' }
                        })}
                        error={errors.targetAmount?.message}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Date</label>
                    <Input
                        type="date"
                        {...register('deadline', { required: 'Target date is required' })}
                        error={errors.deadline?.message}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Color Theme</label>
                <div className="flex gap-3">
                    {COLORS.map((c) => (
                        <button
                            key={c.value}
                            type="button"
                            onClick={() => setValue('color', c.value)}
                            className={`w-8 h-8 rounded-full ${c.bgClass} transition-transform ${
                                selectedColor === c.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                            }`}
                            title={c.name}
                        />
                    ))}
                </div>
                {/* Hidden input to register the color in react-hook-form */}
                <input type="hidden" {...register('color')} />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button type="submit" isLoading={isSubmitting}>
                    {defaultValues ? 'Update Goal' : 'Save Goal'}
                </Button>
            </div>
        </form>
    );
};
