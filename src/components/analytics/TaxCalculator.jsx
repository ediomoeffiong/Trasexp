import React, { useState, useEffect } from 'react';
import { calculateTaxAuto } from '../../api/analytics';
import { useSettings } from '../../hooks/useSettings';
import { formatCurrency as formatCurrencyUtil } from '../../utils/currency';
import './TaxCalculator.css';

const COUNTRIES = [
    { code: 'NG', name: 'Nigeria' }
    // Future: Add more countries here
];

const TAX_TYPES = [
    { value: 'PIT', label: 'Personal Income Tax (PIT)' },
    { value: 'CIT', label: 'Company Income Tax (CIT)' },
    { value: 'VAT', label: 'Value Added Tax (VAT)' }
];

const TaxCalculator = () => {
    const currentYear = new Date().getFullYear();
    const { preferences } = useSettings();
    const currencyCode = preferences?.defaultCurrency || 'NGN';

    // State
    const [mode, setMode] = useState('automatic'); // 'automatic' or 'manual'
    const [country, setCountry] = useState('NG');
    const [taxType, setTaxType] = useState('PIT');
    const [year, setYear] = useState(currentYear);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    //Calculate tax automatically when parameters change
    useEffect(() => {
        if (mode === 'automatic') {
            calculateTax();
        }
    }, [country, taxType, year, mode]);

    const calculateTax = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                type: taxType,
                country: country,
                year: year
            };

            const data = await calculateTaxAuto(params);
            setResult(data);
        } catch (err) {
            setError(err.message || 'Failed to calculate tax');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return formatCurrencyUtil(amount || 0, currencyCode);
    };

    const formatPercentage = (value) => {
        if (!value) return '0%';
        return `${value.toFixed(2)}%`;
    };

    // Generate year options (current year and past 5 years)
    const yearOptions = [];
    for (let i = 0; i < 6; i++) {
        yearOptions.push(currentYear - i);
    }

    return (
        <div className="tax-calculator">
            <div className="tax-calculator-header">
                <h2>Tax Calculator</h2>
                <p className="disclaimer">
                    ⚠️ Tax estimates based on 2026 Nigeria Tax Act (NTA). This tool provides estimates only and does not replace professional advice.
                </p>
            </div>

            {/* Controls */}
            <div className="tax-controls">
                {/* Tax Type Selector */}
                <div className="control-group">
                    <label htmlFor="taxType">Tax Type</label>
                    <select
                        id="taxType"
                        value={taxType}
                        onChange={(e) => setTaxType(e.target.value)}
                        className="control-input"
                    >
                        {TAX_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Country Selector */}
                <div className="control-group">
                    <label htmlFor="country">Country</label>
                    <select
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="control-input"
                    >
                        {COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Year Selector */}
                <div className="control-group">
                    <label htmlFor="year">Year</label>
                    <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="control-input"
                    >
                        {yearOptions.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="tax-loading">
                    <div className="spinner"></div>
                    <p>Calculating tax...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="tax-error">
                    <p>❌ {error}</p>
                </div>
            )}

            {/* Results */}
            {result && !loading && !error && (
                <div className="tax-results">
                    {result.income <= 0 && (
                        <div className="no-data-message">
                            <p>😔 No transaction data available for {year}</p>
                            <p className="subdued">Add income and expense transactions to see tax calculations.</p>
                        </div>
                    )}

                    {result.income > 0 && (
                        <>
                            {/* Summary Cards */}
                            <div className="tax-summary-grid">
                                <div className="tax-summary-card">
                                    <div className="card-label mb-1">Total Income</div>
                                    <div className="card-value income font-bold py-2">
                                        {formatCurrency(result.income)}
                                    </div>
                                </div>

                                <div className="tax-summary-card">
                                    <div className="card-label mb-1">Deductions/Expenses</div>
                                    <div className="card-value expense font-bold py-2">
                                        {formatCurrency(result.expenses)}
                                    </div>
                                </div>

                                <div className="tax-summary-card">
                                    <div className="card-label mb-1">Taxable {taxType === 'CIT' ? 'Profit' : 'Income'}</div>
                                    <div className="card-value font-bold py-2">
                                        {formatCurrency(result.taxableIncome)}
                                    </div>
                                </div>

                                <div className="tax-summary-card highlight">
                                    <div className="card-label mb-1">Annual Tax</div>
                                    <div className="card-value tax font-bold py-2">
                                        {formatCurrency(result.annualTax)}
                                    </div>
                                </div>

                                <div className="tax-summary-card">
                                    <div className="card-label mb-1">Monthly Tax</div>
                                    <div className="card-value font-bold py-2">
                                        {formatCurrency(result.monthlyTax)}
                                    </div>
                                </div>

                                <div className="tax-summary-card">
                                    <div className="card-label mb-1">Effective Rate</div>
                                    <div className="card-value font-bold py-2">
                                        {formatPercentage(result.effectiveRate)}
                                    </div>
                                </div>
                            </div>

                            {/* Breakdown */}
                            {result.breakdown && Object.keys(result.breakdown).length > 0 && (
                                <div className="tax-breakdown mt-8">
                                    <h3 className="mb-4">Tax Calculation Details</h3>
                                    <table className="breakdown-table">
                                        <tbody>
                                            {Object.entries(result.breakdown).map(([key, value]) => (
                                                <tr key={key} className="border-b border-gray-100">
                                                    <td className="breakdown-label py-4 pr-4">
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </td>
                                                    <td className="breakdown-value py-4 font-medium text-right">
                                                        {typeof value === 'boolean'
                                                            ? (value ? '✅ Yes' : '❌ No')
                                                            : typeof value === 'number' || (typeof value === 'string' && !isNaN(value))
                                                                ? formatCurrency(value)
                                                                : value}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaxCalculator;
