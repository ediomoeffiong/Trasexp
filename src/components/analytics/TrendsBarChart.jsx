import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const TrendsBarChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px] text-muted">
                No trend data available
            </div>
        );
    }

    return (
        <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
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
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                        formatter={(value) => [`$${value.toFixed(2)}`, '']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="rect" align="center" verticalAlign="top" height={36} />
                    <Bar
                        name="Income"
                        dataKey="income"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                        animationDuration={1500}
                    />
                    <Bar
                        name="Expense"
                        dataKey="expense"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                        animationDuration={1500}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendsBarChart;
