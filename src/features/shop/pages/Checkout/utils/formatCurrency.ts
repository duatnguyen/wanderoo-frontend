export function formatCurrencyVND(value: number | undefined | null): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0đ";
  }
  return `${value.toLocaleString("vi-VN")}đ`;
}
