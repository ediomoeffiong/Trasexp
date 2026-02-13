import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    PieChart as PieChartIcon,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    TrendingDown,
    RefreshCw
} from 'lucide-react';
import { getAnalyticsSummary } from '../api/transactions';
import CategoryPieChart from '../components/analytics/CategoryPieChart';
import TrendsBarChart from '../components/analytics/TrendsBarChart';
import BalanceLineChart from '../components/analytics/BalanceLineChart';
import TaxCalculator from '../components/analytics/TaxCalculator';
import Loading from '../components/common/Loading';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAnalytics = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const summary = await getAnalyticsSummary();
            setData(summary);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError('Could not load analytics data. Please check your connection.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) return <Loading message="Generating financial reports..." />;

    const hasData = data && (data.categoryBreakdown?.length > 0 || data.monthlyTrends?.length > 0);

    return (
        <div className="container page-content">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Financial Analytics</h1>
                    <p className="text-muted">Visual insights into your spending and income trends.</p>
                </div>
                <button
                    onClick={() => fetchAnalytics(true)}
                    className={`btn btn-secondary flex items-center gap-2 ${refreshing ? 'opacity-50 pointer-events-none' : ''}`}
                    disabled={refreshing}
                >
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error ? (
                <div className="error-card card p-12 text-center border-danger">
                    <TrendingDown size={40} className="text-danger mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Analytics Unavailable</h2>
                    <p className="text-muted mb-6">{error}</p>
                    <button className="btn btn-primary" onClick={() => fetchAnalytics()}>
                        Try Again
                    </button>
                </div>
            ) : !hasData ? (
                <div className="card p-12 text-center bg-gray-50 border-dashed">
                    <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Insufficient Data</h2>
                    <p className="text-muted mb-6">
                        We need more transactions to generate meaningful insights and charts.
                    </p>
                </div>
            ) : (
                <div className="analytics-layout flex flex-col gap-8">
                    {/* Top Row: Trends Comparison */}
                    <div className="card p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="text-primary" size={20} />
                            <h3 className="font-bold text-lg">Income vs Expenses</h3>
                        </div>
                        <TrendsBarChart data={data.monthlyTrends} />
                    </div>

                    {/* Bottom Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Category Distribution */}
                        <div className="card p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <PieChartIcon className="text-primary" size={20} />
                                <h3 className="font-bold text-lg">Expense Distribution</h3>
                            </div>
                            <CategoryPieChart data={data.categoryBreakdown} />
                        </div>

                        {/* Balance Trajectory */}
                        <div className="card p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp className="text-primary" size={20} />
                                <h3 className="font-bold text-lg">Balance Trajectory</h3>
                            </div>
                            <BalanceLineChart data={data.monthlyTrends} />
                        </div>
                    </div>

                    {/* Tax Calculator Section */}
                    <div className="card p-6">
                        <TaxCalculator />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
