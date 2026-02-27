/**
 * Currency Utility
 * 
 * Provides centralized logic for currency formatting and symbol retrieval
 * based on user preferences.
 */

/**
 * Get the currency symbol for a given currency code
 * @param {string} currencyCode - e.g., 'NGN', 'USD', 'EUR'
 * @returns {string} - The symbol (e.g., '₦', '$')
 */
export const getCurrencySymbol = (currencyCode = 'NGN') => {
    switch (currencyCode) {
        case 'NGN':
            return '₦';
        case 'USD':
            return '$';
        case 'EUR':
            return '€';
        case 'GBP':
            return '£';
        default:
            return '₦';
    }
};

/**
 * Format an amount as currency
 * @param {number} amount - The numeric amount
 * @param {string} currencyCode - The currency code (default: 'NGN')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'NGN') => {
    const locale = currencyCode === 'NGN' ? 'en-NG' : 'en-US';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
