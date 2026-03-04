import React, { useState } from "react";
import { Input, DatePicker } from "antd";
import { type Dayjs } from "dayjs";

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
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search Input */}
      <div className="flex-1 min-w-0">
        <Input.Search
          placeholder="Tìm kiếm đơn hàng theo ID đơn hàng hoặc tên sản phẩm"
          allowClear
          enterButton
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full"
          onSearch={(value) => {
            // hook tích hợp backend sau; hiện tại chỉ log để demo
            console.log("Search orders by id or product name:", value);
          }}
        />
      </div>

      {/* Date Range Picker */}
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={(dates) => {
          onStartDateChange(dates ? dates[0] : null);
          onEndDateChange(dates ? dates[1] : null);
        }}
        format="DD/MM/YYYY"
        className="w-full sm:w-auto"
        placeholder={['Từ ngày', 'Đến ngày']}
      />
    </div>
  );
};

export default DateRangeFilter;
