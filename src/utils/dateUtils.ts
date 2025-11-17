/**
 * Date formatting utilities for Vietnamese locale
 */

/**
 * Format a date to a beautiful Vietnamese format
 * @param date - Date object, ISO string, or timestamp
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number | null | undefined,
  options: {
    showTime?: boolean;
    showWeekday?: boolean;
    shortFormat?: boolean;
  } = {}
): string => {
  if (!date) return "Chưa có thông tin";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Ngày không hợp lệ";

  const { showTime = true, showWeekday = false, shortFormat = false } = options;

  if (shortFormat) {
    // Short format: DD/MM/YYYY
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Full format with Vietnamese locale
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(showWeekday && { weekday: 'long' }),
    ...(showTime && {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
  };

  return dateObj.toLocaleString('vi-VN', dateOptions);
};

/**
 * Format date for timeline display (compact format)
 * @param date - Date to format
 * @returns Formatted date string for timeline
 */
export const formatTimelineDate = (date: Date | string | number | null | undefined): string => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format date for order display (readable format)
 * @param date - Date to format
 * @returns Formatted date string for orders
 */
export const formatOrderDate = (date: Date | string | number | null | undefined): string => {
  if (!date) return "Chưa có thông tin";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Ngày không hợp lệ";

  return dateObj.toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time string (e.g., "2 giờ trước", "hôm qua")
 * @param date - Date to compare
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Vừa xong";
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  if (diffInDays === 1) return "Hôm qua";
  if (diffInDays < 7) return `${diffInDays} ngày trước`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;

  return `${Math.floor(diffInDays / 365)} năm trước`;
};

/**
 * Check if date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export const isToday = (date: Date | string | number): boolean => {
  const dateObj = new Date(date);
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if date is yesterday
 * @param date - Date to check
 * @returns True if date is yesterday
 */
export const isYesterday = (date: Date | string | number): boolean => {
  const dateObj = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateObj.toDateString() === yesterday.toDateString();
};