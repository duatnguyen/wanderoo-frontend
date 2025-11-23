export function formatCurrencyVND(value: number): string {
  if (isNaN(value) || value < 0) {
    return "0đ";
  }
  return `${value.toLocaleString("vi-VN")}đ`;
}

