import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import { useSettings } from '../../hooks/useSettings';
import { getCurrencySymbol } from '../../utils/currency';

const BalanceLineChart = ({ data }) => {
    const { preferences } = useSettings();
    const symbol = getCurrencySymbol(preferences?.defaultCurrency);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px] text-muted">
                No balance data available
            </div>
        );
    }

    // Calculate cumulative balance for the line chart
    let runningBalance = 0;
    const chartData = data.map(item => {
        const monthBalance = parseFloat(item.income) - parseFloat(item.expense);
        runningBalance += monthBalance;
        return {
            month: item.month,
            balance: runningBalance
        };
    });

    return (
        <div style={{ height: '350px', width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        tickFormatter={(value) => `${symbol}${value}`}
                    />
                    <Tooltip
                        formatter={(value) => [`${symbol}${value.toFixed(2)}`, 'Balance']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#2563eb"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorBalance)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BalanceLineChart;
