/**
 * Currency formatting utility for M&M Tracker
 * Handles converting amounts to user's selected currency with correct symbol
 */

/**
 * Get currency symbol for display
 * @param {string} currency - "USD" or "INR"
 * @returns {string} Currency symbol ($ or ₹)
 */
export const getCurrencySymbol = (currency) => {
  if (!currency) return "$";
  return currency === "INR" ? "₹" : "$";
};

/**
 * Format amount with currency symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - User's currency setting ("USD" or "INR")
 * @param {boolean} includeSymbol - Whether to include currency symbol (default: true)
 * @returns {string} Formatted amount (e.g., "$100.00" or "₹8300.00")
 */
export const formatMoney = (amount, currency = "USD", includeSymbol = true) => {
  if (!amount && amount !== 0) return includeSymbol ? `${getCurrencySymbol(currency)}0.00` : "0.00";
  
  const symbol = getCurrencySymbol(currency);
  const formatted = parseFloat(amount).toFixed(2);
  
  if (includeSymbol) {
    return `${symbol}${formatted}`;
  }
  return formatted;
};

/**
 * Format for display in lists/tables (compact format)
 * @param {number} amount
 * @param {string} currency
 * @returns {string} Formatted amount
 */
export const formatMoneyCompact = (amount, currency = "USD") => {
  return formatMoney(amount, currency, true);
};
