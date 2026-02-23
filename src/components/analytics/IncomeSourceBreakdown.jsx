import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { formatCurrency } from '../../utils/currency';
import { Coins, CheckCircle2, AlertCircle } from 'lucide-react';

const IncomeSourceBreakdown = ({ data }) => {
    const { preferences } = useSettings();
    const currencyCode = preferences?.defaultCurrency || 'NGN';

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-muted italic">
                No income sources found for the selected period.
            </div>
        );
    }

    return (
        <div className="income-source-breakdown">
            <div className="flex flex-col gap-4">
                {data.map((source) => {
                    const isFullyAllocated = source.remainingBalance <= 0;
                    const isPartiallyAllocated = source.percentageAllocated > 0 && !isFullyAllocated;

                    return (
                        <div key={source.id} className="income-source-card bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-full ${isFullyAllocated ? 'bg-success-light text-success' : 'bg-blue-50 text-blue-600'}`}>
                                        <Coins size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-main">{source.title}</h4>
                                        <span className="text-[10px] text-muted uppercase tracking-wider">
                                            Total: {formatCurrency(source.amount, currencyCode)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-bold ${isFullyAllocated ? 'text-success' : 'text-main'}`}>
                                        {formatCurrency(source.remainingBalance, currencyCode)}
                                    </div>
                                    <span className="text-[10px] text-muted">Remaining Balance</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-muted">Allocation Progress</span>
                                    <span className="font-medium">{source.percentageAllocated.toFixed(1)}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-700 ${isFullyAllocated ? 'bg-success' : 'bg-blue-500'}`}
                                        style={{ width: `${source.percentageAllocated}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[10px] mt-1">
                                    <span className="flex items-center gap-1 text-muted">
                                        {source.allocatedAmount > 0 ? (
                                            <CheckCircle2 size={10} className="text-success" />
                                        ) : (
                                            <AlertCircle size={10} className="text-amber-500" />
                                        )}
                                        {formatCurrency(source.allocatedAmount, currencyCode)} allocated
                                    </span>
                                    {isFullyAllocated && (
                                        <span className="text-success font-medium">Fully spent</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default IncomeSourceBreakdown;
