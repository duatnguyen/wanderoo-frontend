import React from "react";
import { Input } from "antd";
import dayjs, { type Dayjs } from "dayjs";

interface DateRangeFilterProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  // Tạm thời giữ props ngày để không phá vỡ API, nhưng không hiển thị bộ lọc ngày.
  return (
    <div className="w-full">
      <Input.Search
        placeholder="Tìm kiếm đơn hàng theo ID đơn hàng hoặc tên sản phẩm"
        allowClear
        enterButton
        className="w-full max-w-[560px]"
        onSearch={(value) => {
          // hook tích hợp backend sau; hiện tại chỉ log để demo
          console.log("Search orders by id or product name:", value);
        }}
      />
    </div>
  );
};

export default DateRangeFilter;
