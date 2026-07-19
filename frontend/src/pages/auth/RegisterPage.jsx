import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Wallet } from 'lucide-react';

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const success = await registerUser(data);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center text-teal-700">
                    <Wallet size={48} strokeWidth={1.5} />
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
                    Create a SpendWise account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-teal-700 hover:text-teal-600 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-slate-200">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    {...register('name', { required: 'Name is required' })}
                                    error={errors.name?.message}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    {...register('email', { 
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    error={errors.email?.message}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('password', { 
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    error={errors.password?.message}
                                />
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full" isLoading={isSubmitting}>
                                Create account
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
