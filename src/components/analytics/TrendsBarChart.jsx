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

    const root = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    const getVar = (name, fallback) => (root ? (root.getPropertyValue(name) || fallback).trim() : fallback);

    const gridStroke = getVar('--grid-stroke', 'var(--border-color)');
    const tickFill = getVar('--text-muted', 'var(--text-muted)');
    const incomeFill = getVar('--success-color', 'var(--success-color)');
    const expenseFill = getVar('--danger-color', 'var(--danger-color)');
    const tooltipCursor = getVar('--tooltip-cursor', 'var(--tooltip-cursor)');

    return (
        <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: tickFill, fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: tickFill, fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: tooltipCursor }}
                        formatter={(value) => [`$${value.toFixed(2)}`, '']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="rect" align="center" verticalAlign="top" height={36} />
                    <Bar
                        name="Income"
                        dataKey="income"
                        fill={incomeFill}
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                        animationDuration={1500}
                    />
                    <Bar
                        name="Expense"
                        dataKey="expense"
                        fill={expenseFill}
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
