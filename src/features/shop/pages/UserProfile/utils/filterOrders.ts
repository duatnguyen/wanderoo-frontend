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
    if (activeTab !== "all" && order.status !== activeTab) {
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

