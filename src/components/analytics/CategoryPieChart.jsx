import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const getCssColors = () => {
  const root = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const g = (name, fallback) => (root ? (root.getPropertyValue(name) || fallback).trim() : fallback);
  return [
    g('--chart-col-1','var(--chart-col-1)'),
    g('--chart-col-2','var(--chart-col-2)'),
    g('--chart-col-3','var(--chart-col-3)'),
    g('--chart-col-4','var(--chart-col-4)'),
    g('--chart-col-5','var(--chart-col-5)'),
    g('--chart-col-6','var(--chart-col-6)'),
    g('--chart-col-7','var(--chart-col-7)'),
  ];
};


const CategoryPieChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px] text-muted">
                No expense data available for categorization
            </div>
        );
    }

    // Map backend DTO to Recharts format
    const chartData = data.map(item => ({
        name: item.category.charAt(0) + item.category.slice(1).toLowerCase(),
        value: parseFloat(item.amount)
    }));

    const COLORS = getCssColors();

    return (
        <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryPieChart;
