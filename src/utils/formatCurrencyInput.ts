/**
 * Format number to VNĐ currency input format (1.000, 1.000.000, etc.)
 * @param value - Number or string to format
 * @returns Formatted string with dot separators
 */
export const formatCurrencyInput = (value: string | number): string => {
  if (!value && value !== 0) return "";
  
  // Remove all non-digit characters
  const numericValue = String(value).replace(/\D/g, "");
  
  if (!numericValue) return "";
  
  // Add dot separators every 3 digits from right to left
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Parse formatted currency input back to number (remove dots)
 * @param value - Formatted string (e.g., "1.000.000")
 * @returns Number or empty string
 */
export const parseCurrencyInput = (value: string): string => {
  if (!value) return "";
  
  // Remove all non-digit characters
  return value.replace(/\D/g, "");
};

