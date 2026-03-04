import dayjs, { type Dayjs } from "dayjs";
import type { Order, OrderStatus } from "../ordersData";

export function filterOrders(
  orders: Order[],
  activeTab: OrderStatus,
  startDate: Dayjs | null,
  endDate: Dayjs | null
): Order[] {
  return orders.filter((order) => {
    // Filter by status
    // For "return" tab, show all return orders (including cancelled ones)
    // Backend already filters return orders, so we don't need to filter by status here
    if (activeTab !== "all" && activeTab !== "return" && order.status !== activeTab) {
      return false;
    }

    // Filter by date range only if both dates are selected
    if (startDate && endDate) {
      const orderDateParts = order.orderDate.split("/");
      if (orderDateParts.length === 3) {
        const [day, month, year] = orderDateParts;
        const orderDateValue = dayjs(
          `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
        );

        // Validate dates
        if (!orderDateValue.isValid()) {
          return true; // If date is invalid, show all orders
        }

        // Compare dates using dayjs (start of day for startDate, end of day for endDate)
        const startOfStartDate = startDate.startOf("day");
        const endOfEndDate = endDate.endOf("day");
        const startOfOrderDate = orderDateValue.startOf("day");

        if (
          startOfOrderDate.isBefore(startOfStartDate) ||
          startOfOrderDate.isAfter(endOfEndDate)
        ) {
          return false;
        }
      }
    }

    return true;
  });
}
