import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/routing/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const TransactionsPage = lazy(() => import('./pages/transactions/TransactionsPage'));
const BudgetsPage = lazy(() => import('./pages/budgets/BudgetsPage'));
const GoalsPage = lazy(() => import('./pages/goals/GoalsPage'));
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const BillsPage = lazy(() => import('./pages/bills/BillsPage'));
const CalendarPage = lazy(() => import('./pages/calendar/CalendarPage'));
const InsightsPage = lazy(() => import('./pages/insights/InsightsPage'));

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Protected Routes wrapped in MainLayout */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-100" />}><DashboardPage /></Suspense>} />
                            <Route path="/transactions" element={<Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-100" />}><TransactionsPage /></Suspense>} />
                            <Route path="/budgets" element={<Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-100" />}><BudgetsPage /></Suspense>} />
                            <Route path="/goals" element={<Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-100" />}><GoalsPage /></Suspense>} />
                            <Route path="/analytics" element={<Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-100" />}><AnalyticsPage /></Suspense>} />
                            <Route path="/profile" element={<Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-100" />}><ProfilePage /></Suspense>} />
                            <Route path="/settings" element={<Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-100" />}><SettingsPage /></Suspense>} />
                            <Route path="/bills" element={<Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-100" />}><BillsPage /></Suspense>} />
                            <Route path="/calendar" element={<Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-100" />}><CalendarPage /></Suspense>} />
                            <Route path="/insights" element={<Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-100" />}><InsightsPage /></Suspense>} />
                        </Route>
                    </Route>

                    {/* Default redirect to login */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;